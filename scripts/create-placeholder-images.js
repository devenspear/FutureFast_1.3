// Script to create placeholder images for resources
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of placeholder images to create
const placeholderImages = [
  'ai-future-of-work.png',
  'ai-index-2025.png',
  'ark-big-ideas-2025.png',
  'cb-insights-tech-trends-2025.png',
  'deloitte-tech-trends-2025.png',
  'future-100-2025.png',
  'hubspot-state-marketing-2025.png',
  'pwc-etre-2025.png',
  'setr-2025.png',
  'tac-tokenization-2024.png',
  'wef-future-jobs-2025.png',
  'disruption-weekly.png'
];

// Create an SVG placeholder for each image
placeholderImages.forEach(imageName => {
  // For disruption-weekly.png, put it in the images directory
  const targetDir = imageName === 'disruption-weekly.png' ? imagesDir : uploadsDir;
  const filePath = path.join(targetDir, imageName);
  
  // Create a simple SVG placeholder with the image name
  const svgContent = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">
    ${imageName.replace('.png', '')}
  </text>
</svg>
  `;
  
  // Write the SVG content to the file
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder image: ${filePath}`);
});

console.log('All placeholder images created successfully!');
