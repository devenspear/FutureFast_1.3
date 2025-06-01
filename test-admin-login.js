// Simple script to test admin login functionality
const http = require('http');
const fs = require('fs');

// Function to make a POST request to the login API
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

// Main function to run the tests
async function runTests() {
  try {
    console.log('Testing admin login functionality...');
    
    // Step 1: Login to admin
    const cookies = await loginToAdmin();
    
    // Step 2: Check authentication status
    await checkAuthStatus(cookies);
    
    console.log('Tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();
