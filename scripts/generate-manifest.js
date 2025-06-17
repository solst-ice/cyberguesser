import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility to convert filename to display name
const filenameToDisplayName = (filename) => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Replace hyphens and underscores with spaces
  const spacedName = nameWithoutExt.replace(/[-_]/g, ' ');
  
  // Capitalize each word
  const capitalizedName = spacedName.replace(/\b\w/g, letter => letter.toUpperCase());
  
  return capitalizedName;
};

// Function to scan a directory for image files
const scanDirectory = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist. Creating it...`);
      fs.mkdirSync(dirPath, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(dirPath);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext) && !file.startsWith('.');
    });

    return imageFiles.map(filename => ({
      filename,
      displayName: filenameToDisplayName(filename),
      path: `/${path.basename(dirPath)}/${filename}`
    }));
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return [];
  }
};

// Main function to generate manifest
const generateManifest = () => {
  const publicDir = path.join(__dirname, '..', 'public');
  const toolsDir = path.join(publicDir, 'tools');
  const xPfpDir = path.join(publicDir, 'x-pfp');

  console.log('Scanning directories for images...');
  
  const tools = scanDirectory(toolsDir);
  const xAccounts = scanDirectory(xPfpDir);

  const manifest = {
    tools: tools,
    xAccounts: xAccounts,
    generatedAt: new Date().toISOString(),
    counts: {
      tools: tools.length,
      xAccounts: xAccounts.length
    }
  };

  // Write manifest to public directory
  const manifestPath = path.join(publicDir, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated manifest with ${tools.length} tools and ${xAccounts.length} X accounts`);
  console.log(`📄 Manifest saved to: ${manifestPath}`);
  
  if (tools.length > 0) {
    console.log('\n🛠️  Found tools:');
    tools.forEach(tool => console.log(`   - ${tool.displayName} (${tool.filename})`));
  }
  
  if (xAccounts.length > 0) {
    console.log('\n🐦 Found X accounts:');
    xAccounts.forEach(account => console.log(`   - ${account.displayName} (${account.filename})`));
  }

  return manifest;
};

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateManifest();
}

export { generateManifest }; 