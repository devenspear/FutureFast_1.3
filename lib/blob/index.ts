import { put, list, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

// Interface for subscriber data
export interface SubscriberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  createdAt: string;
}

// In-memory fallback storage for development environments without Blob Storage configured
const localSubscribers: SubscriberData[] = [];

// Check if Vercel Blob is properly configured
const isBlobConfigured = () => {
  return process.env.BLOB_READ_WRITE_TOKEN !== undefined;
};

// Save subscriber data to Blob Storage
export async function saveSubscriber(firstName: string, lastName: string, email: string, company: string = ''): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Create a unique ID for the subscriber
    const id = uuidv4();
    
    // Create subscriber data object
    const subscriberData: SubscriberData = {
      id,
      firstName,
      lastName,
      email,
      company,
      createdAt: new Date().toISOString()
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(subscriberData);
    
    // Check if Blob Storage is configured
    if (isBlobConfigured()) {
      try {
        // Store in Blob Storage with email as part of the filename for easy lookup
        // Using a folder structure: subscribers/email-id.json
        const filename = `subscribers/${email.replace(/[^a-zA-Z0-9]/g, '_')}-${id}.json`;
        
        // Upload to Blob Storage
        await put(filename, jsonData, {
          access: 'public',
          contentType: 'application/json'
        });
      } catch (blobError) {
        console.error('Blob Storage error:', blobError);
        // Fall back to in-memory storage
        localSubscribers.push(subscriberData);
      }
    } else {
      console.warn('Blob Storage not configured, using in-memory storage');
      // Use in-memory storage as fallback
      localSubscribers.push(subscriberData);
    }
    
    return { 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!',
      id
    };
  } catch (error) {
    console.error('Error saving subscriber:', error);
    return { 
      success: false, 
      message: 'An error occurred while processing your subscription. Please try again later.' 
    };
  }
}

// Check if an email already exists in the subscribers
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Check in-memory storage first
    const emailExists = localSubscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (emailExists) return true;
    
    // If Blob Storage is configured, check there too
    if (isBlobConfigured()) {
      try {
        // List all blobs in the subscribers folder
        const { blobs } = await list({ prefix: 'subscribers/' });
        
        // Check if any blob contains this email in its filename
        const emailPattern = email.replace(/[^a-zA-Z0-9]/g, '_');
        return blobs.some(blob => blob.pathname.includes(emailPattern));
      } catch (blobError) {
        console.error('Blob Storage error:', blobError);
        return false; // Assume email doesn't exist if there's an error
      }
    }
    
    return false; // Assume email doesn't exist if Blob Storage is not configured
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false; // Assume email doesn't exist if there's an error
  }
}

// Get all subscribers
export async function getSubscribers(): Promise<SubscriberData[]> {
  try {
    let subscribers: SubscriberData[] = [...localSubscribers]; // Start with in-memory subscribers
    
    // If Blob Storage is configured, get subscribers from there too
    if (isBlobConfigured()) {
      try {
        // List all blobs in the subscribers folder
        const { blobs } = await list({ prefix: 'subscribers/' });
        
        // Process each blob
        for (const blob of blobs) {
          // Fetch the blob content
          const response = await fetch(blob.url);
          if (response.ok) {
            const subscriberData = await response.json();
            
            // Check if this subscriber is already in our list (from in-memory storage)
            const existingIndex = subscribers.findIndex(sub => sub.id === subscriberData.id);
            if (existingIndex >= 0) {
              // Replace with the blob version
              subscribers[existingIndex] = subscriberData;
            } else {
              // Add to our list
              subscribers.push(subscriberData);
            }
          }
        }
      } catch (blobError) {
        console.error('Blob Storage error:', blobError);
        // Continue with just in-memory subscribers
      }
    }
    
    // Sort by creation date (newest first)
    return subscribers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return localSubscribers; // Return in-memory subscribers as fallback
  }
}

// Delete a subscriber by ID
export async function deleteSubscriber(id: string): Promise<boolean> {
  try {
    // Remove from in-memory storage
    const initialLength = localSubscribers.length;
    const filteredSubscribers = localSubscribers.filter(sub => sub.id !== id);
    localSubscribers.length = 0;
    localSubscribers.push(...filteredSubscribers);
    
    const removedFromMemory = initialLength > localSubscribers.length;
    
    // If Blob Storage is configured, delete from there too
    if (isBlobConfigured()) {
      try {
        // List all blobs in the subscribers folder
        const { blobs } = await list({ prefix: 'subscribers/' });
        
        // Find the blob that contains this ID
        const targetBlob = blobs.find(blob => blob.pathname.includes(id));
        
        if (targetBlob) {
          // Delete the blob
          await del(targetBlob.pathname);
          return true;
        }
      } catch (blobError) {
        console.error('Blob Storage error:', blobError);
        return removedFromMemory; // Return true if we at least removed from memory
      }
    }
    
    return removedFromMemory;
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return false;
  }
}
