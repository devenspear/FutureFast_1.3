const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Create a canvas for the social share image (1200x630 is the recommended size for most platforms)
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// Fill the background with black
context.fillStyle = '#000000';
context.fillRect(0, 0, width, height);

// Add a subtle gradient overlay
const gradient = context.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, 'rgba(0, 50, 100, 0.3)');
gradient.addColorStop(1, 'rgba(50, 0, 100, 0.3)');
context.fillStyle = gradient;
context.fillRect(0, 0, width, height);

// Add a grid pattern for the futuristic look
context.strokeStyle = 'rgba(0, 200, 255, 0.1)';
context.lineWidth = 1;

// Vertical lines
for (let x = 0; x <= width; x += 50) {
  context.beginPath();
  context.moveTo(x, 0);
  context.lineTo(x, height);
  context.stroke();
}

// Add the FutureFast logo text
context.font = 'bold 80px Arial';
context.textAlign = 'center';
context.textBaseline = 'middle';

// Gold gradient for the text
const textGradient = context.createLinearGradient(width/2 - 250, height/2, width/2 + 250, height/2);
textGradient.addColorStop(0, '#99731A');
textGradient.addColorStop(0.5, '#D4AF37');
textGradient.addColorStop(1, '#99731A');
context.fillStyle = textGradient;

// Draw the main title
context.fillText('FUTUREFAST', width/2, height/2 - 50);

// Add the tagline
context.font = '40px Arial';
context.fillStyle = '#FFFFFF';
context.fillText('Empowering Speed', width/2, height/2 + 50);

// Add a blue glow effect around the text
context.shadowColor = 'rgba(0, 200, 255, 0.5)';
context.shadowBlur = 20;
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/social-share.png', buffer);
fs.writeFileSync('./public/twitter-share.png', buffer);

console.log('Social share images created successfully!');
