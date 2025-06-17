// Custom ASCII Art Converter using Canvas API
// Browser-compatible image to ASCII conversion with color support

export class AsciiConverter {
  constructor() {
    // ASCII characters ordered from lightest to darkest
    this.asciiChars = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  async convertImageToAscii(imagePath, options = {}) {
    const {
      width = 80,
      height = 40,
      colored = true,
      fontSize = 8
    } = options;

    try {
      // Load image
      const img = await this.loadImage(imagePath);
      
      // Set canvas size
      this.canvas.width = width;
      this.canvas.height = height;
      
      // Draw image to canvas
      this.ctx.drawImage(img, 0, 0, width, height);
      
      // Get image data
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      let asciiArt = '';
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;
          const r = data[pixelIndex];
          const g = data[pixelIndex + 1];
          const b = data[pixelIndex + 2];
          
          // Calculate brightness (0-255)
          const brightness = (r + g + b) / 3;
          
          // Convert brightness to ASCII character index
          const charIndex = Math.floor((brightness / 255) * (this.asciiChars.length - 1));
          const asciiChar = this.asciiChars[charIndex];
          
          if (colored) {
            // Create colored ASCII with ANSI-like styling for web
            const color = this.rgbToHex(r, g, b);
            asciiArt += `<span style="color: ${color}">${asciiChar}</span>`;
          } else {
            asciiArt += asciiChar;
          }
        }
        asciiArt += '\n';
      }
      
      return asciiArt;
    } catch (error) {
      console.error('Failed to convert image to ASCII:', error);
      throw error;
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS for local images
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Alternative method for better contrast
  async convertImageToAsciiEnhanced(imagePath, options = {}) {
    const {
      width = 60,
      height = 30,
      colored = true,
      contrast = 1.2,
      brightness = 0.1
    } = options;

    try {
      const img = await this.loadImage(imagePath);
      
      this.canvas.width = width;
      this.canvas.height = height;
      
      // Apply filters for better contrast
      this.ctx.filter = `contrast(${contrast}) brightness(${1 + brightness})`;
      this.ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      const result = [];
      
      for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;
          const r = data[pixelIndex];
          const g = data[pixelIndex + 1];
          const b = data[pixelIndex + 2];
          
          // Calculate luminance using proper weights
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // Convert to ASCII character
          const charIndex = Math.floor((luminance / 255) * (this.asciiChars.length - 1));
          const asciiChar = this.asciiChars[charIndex];
          
          if (colored) {
            // Enhance colors for better visibility
            const enhancedR = Math.min(255, Math.floor(r * 1.3));
            const enhancedG = Math.min(255, Math.floor(g * 1.3));
            const enhancedB = Math.min(255, Math.floor(b * 1.3));
            
            row.push({
              char: asciiChar,
              color: this.rgbToHex(enhancedR, enhancedG, enhancedB)
            });
          } else {
            row.push({ char: asciiChar, color: '#00ff41' });
          }
        }
        result.push(row);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to convert image to ASCII (enhanced):', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const asciiConverter = new AsciiConverter(); 