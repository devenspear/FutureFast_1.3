// Script to test direct admin dashboard access
const http = require('http');
const fs = require('fs');

// Function to login and get auth cookie
async function loginAndGetCookie() {
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
      if (cookies) {
        console.log('Auth cookie received successfully');
      } else {
        console.log('No auth cookie received');
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

// Function to access admin dashboard
async function accessAdminDashboard(cookies) {
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
      console.log(`Admin Dashboard Access Status Code: ${res.statusCode}`);
      console.log(`Admin Dashboard Access Location: ${res.headers.location || 'No redirect'}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Save a small sample of the response to a file
        const sample = data.substring(0, 500) + '... (truncated)';
        fs.writeFileSync('admin-dashboard-response.txt', sample);
        console.log('Response sample saved to admin-dashboard-response.txt');
        resolve(res.statusCode);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error accessing admin dashboard:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Main function to run the tests
async function runTests() {
  try {
    console.log('Testing admin dashboard access...');
    
    // Step 1: Login to admin and get cookie
    const cookies = await loginAndGetCookie();
    
    // Step 2: Try to access admin dashboard with cookie
    await accessAdminDashboard(cookies);
    
    console.log('Tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();
