// Simple script to test the fixed admin login functionality
const http = require('http');
const fs = require('fs');

// Function to make a POST request to the admin login API
function loginToAdmin() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Login Status Code: ${res.statusCode}`);
      
      // Get the cookies from the response
      const cookies = res.headers['set-cookie'];
      console.log('Cookies received:', cookies);
      
      if (cookies) {
        // Save cookies to a file for later use
        fs.writeFileSync('admin-cookies.txt', cookies.join('\n'));
        console.log('Cookies saved to admin-cookies.txt');
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Login Response:', data);
        resolve(cookies);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error during login:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Function to check authentication status
function checkAuthStatus(cookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/auth/status',
      method: 'GET',
      headers: {
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Auth Status Code: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Auth Status Response:', data);
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error checking auth status:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Function to access the admin page with cookies
function accessAdminPage(cookies) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/admin',
      method: 'GET',
      headers: {
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Admin Page Access Status Code: ${res.statusCode}`);
      console.log(`Admin Page Access Location: ${res.headers.location || 'No redirect'}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Save a small sample of the response to a file
        const sample = data.substring(0, 500) + '... (truncated)';
        fs.writeFileSync('admin-page-response.txt', sample);
        console.log('Response sample saved to admin-page-response.txt');
        resolve(res.statusCode);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error accessing admin page:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Main function to run the tests
async function runTests() {
  try {
    console.log('Testing admin login functionality...');
    
    // Step 1: Login to admin
    const cookies = await loginToAdmin();
    
    // Step 2: Check authentication status
    await checkAuthStatus(cookies);
    
    // Step 3: Access admin page
    await accessAdminPage(cookies);
    
    console.log('Tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();
