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
    
    // Store in Blob Storage with email as part of the filename for easy lookup
    // Using a folder structure: subscribers/email-id.json
    const filename = `subscribers/${email.replace(/[^a-zA-Z0-9]/g, '_')}-${id}.json`;
    
    // Upload to Blob Storage
    await put(filename, jsonData, {
      access: 'public',
      contentType: 'application/json'
    });
    
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
    // List all blobs in the subscribers folder
    const { blobs } = await list({ prefix: 'subscribers/' });
    
    // Check if any blob contains this email in its filename
    const emailPattern = email.replace(/[^a-zA-Z0-9]/g, '_');
    return blobs.some(blob => blob.pathname.includes(emailPattern));
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false; // Assume email doesn't exist if there's an error
  }
}

// Get all subscribers
export async function getSubscribers(): Promise<SubscriberData[]> {
  try {
    // List all blobs in the subscribers folder
    const { blobs } = await list({ prefix: 'subscribers/' });
    
    // Array to hold all subscriber data
    const subscribers: SubscriberData[] = [];
    
    // Process each blob
    for (const blob of blobs) {
      // Fetch the blob content
      const response = await fetch(blob.url);
      if (response.ok) {
        const subscriberData = await response.json();
        subscribers.push(subscriberData);
      }
    }
    
    // Sort by creation date (newest first)
    return subscribers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return [];
  }
}

// Delete a subscriber by ID
export async function deleteSubscriber(id: string): Promise<boolean> {
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
    
    return false;
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return false;
  }
}
