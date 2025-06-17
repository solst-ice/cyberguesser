// Utility to convert filename to display name
export const filenameToDisplayName = (filename) => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Replace hyphens and underscores with spaces
  const spacedName = nameWithoutExt.replace(/[-_]/g, ' ');
  
  // Capitalize each word
  const capitalizedName = spacedName.replace(/\b\w/g, letter => letter.toUpperCase());
  
  return capitalizedName;
};

// Convert display name back to filename format
export const displayNameToFilename = (displayName) => {
  return displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Function to get image path from display name
export const getImagePath = (displayName, mode) => {
  const folderPath = mode === 'tools' ? '/tools' : '/x-pfp';
  const filename = displayNameToFilename(displayName);
  return `${folderPath}/${filename}.png`;
};

// Function to load the image manifest
const loadImageManifest = async () => {
  try {
    const response = await fetch('/image-manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading image manifest:', error);
    return null;
  }
};

// Function to get available images from manifest
export const getAvailableImages = async (mode) => {
  try {
    const manifest = await loadImageManifest();
    
    if (!manifest) {
      console.warn('No manifest found, falling back to empty list');
      return [];
    }

    const imageList = mode === 'tools' ? manifest.tools : manifest.xAccounts;
    
    if (!imageList || imageList.length === 0) {
      console.warn(`No images found for mode: ${mode}`);
      return [];
    }

    // Return array of display names
    return imageList.map(item => item.displayName);
    
  } catch (error) {
    console.error('Error getting available images:', error);
    return [];
  }
};

// Function to get image path from manifest data
export const getImagePathFromManifest = async (displayName, mode) => {
  try {
    const manifest = await loadImageManifest();
    
    if (!manifest) {
      // Fallback to original method
      return getImagePath(displayName, mode);
    }

    const imageList = mode === 'tools' ? manifest.tools : manifest.xAccounts;
    const imageItem = imageList.find(item => item.displayName === displayName);
    
    if (imageItem) {
      return imageItem.path;
    }
    
    // Fallback to original method
    return getImagePath(displayName, mode);
    
  } catch (error) {
    console.error('Error getting image path from manifest:', error);
    // Fallback to original method
    return getImagePath(displayName, mode);
  }
};

// Function to check if an image exists
export const checkImageExists = async (imagePath) => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}; 