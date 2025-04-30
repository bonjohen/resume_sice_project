/**
 * Simple build report script
 * Reports the size of CSS and JS files
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Function to get file size in KB
function getFileSizeInKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

// Function to get gzipped file size in KB
function getGzippedSizeInKB(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const gzippedContent = zlib.gzipSync(fileContent);
  return (gzippedContent.length / 1024).toFixed(2);
}

// Function to get all files with specific extensions
function getFilesWithExtensions(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(getFilesWithExtensions(filePath, extensions));
    } else {
      // Check if file has one of the specified extensions
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Main function
function generateSizeReport() {
  console.log('Building size report...');
  console.log('======================');
  
  // Get all CSS and JS files
  const cssFiles = getFilesWithExtensions('.', ['.css']);
  const jsFiles = getFilesWithExtensions('.', ['.js']);
  
  // Calculate total sizes
  let totalSize = 0;
  let totalGzippedSize = 0;
  
  // Report CSS files
  console.log('\nCSS Files:');
  console.log('---------');
  cssFiles.forEach(file => {
    const size = getFileSizeInKB(file);
    const gzippedSize = getGzippedSizeInKB(file);
    totalSize += parseFloat(size);
    totalGzippedSize += parseFloat(gzippedSize);
    console.log(`${file}: ${size} KB (${gzippedSize} KB gzipped)`);
  });
  
  // Report JS files
  console.log('\nJS Files:');
  console.log('--------');
  jsFiles.forEach(file => {
    const size = getFileSizeInKB(file);
    const gzippedSize = getGzippedSizeInKB(file);
    totalSize += parseFloat(size);
    totalGzippedSize += parseFloat(gzippedSize);
    console.log(`${file}: ${size} KB (${gzippedSize} KB gzipped)`);
  });
  
  // Report totals
  console.log('\nTotal:');
  console.log('------');
  console.log(`Total size: ${totalSize.toFixed(2)} KB`);
  console.log(`Total gzipped size: ${totalGzippedSize.toFixed(2)} KB`);
  
  // Check if we meet the target
  const targetMet = totalGzippedSize < 150;
  console.log(`\nTarget (< 150 KB gzipped): ${targetMet ? 'MET ✓' : 'NOT MET ✗'}`);
}

// Run the report
generateSizeReport();
