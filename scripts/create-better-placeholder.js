// Script to create a better placeholder image for Disruption Weekly
const fs = require('fs');
const path = require('path');

// Create a simple HTML file that will be used to generate a better placeholder
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 600px;
      height: 338px;
      background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
      color: white;
      font-family: Arial, sans-serif;
      overflow: hidden;
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #64ffda, #00bcd4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 18px;
      opacity: 0.8;
      max-width: 400px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Disruption Weekly</h1>
    <p>Stay ahead of the curve with insights on emerging technologies and market trends</p>
  </div>
</body>
</html>
`;

// Write the HTML file
const htmlPath = path.join(__dirname, 'disruption-weekly-placeholder.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('Created HTML placeholder. Please take a screenshot of this file in a browser and save it as public/images/disruption-weekly.png');
