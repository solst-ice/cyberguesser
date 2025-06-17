// ASCII Art Loader - loads pre-rendered ASCII files
// Replaces live conversion with fast file loading

export class AsciiLoader {
  constructor() {
    this.cache = new Map();
  }

  // Downsample ASCII art to optimize display size while maintaining aspect ratio
  downsampleAscii(asciiData) {
    if (!asciiData || !Array.isArray(asciiData) || asciiData.length === 0) {
      return asciiData;
    }

    const downsampledArt = [];
    
    // Take every 2nd row to reduce character count while maintaining detail
    for (let rowIndex = 0; rowIndex < asciiData.length; rowIndex += 2) {
      const row = asciiData[rowIndex];
      if (!Array.isArray(row)) continue;
      
      const downsampledRow = [];
      
      // Take every 2nd character to reduce character count while maintaining detail
      for (let charIndex = 0; charIndex < row.length; charIndex += 2) {
        const pixel = row[charIndex];
        if (pixel && typeof pixel === 'object' && pixel.char !== undefined) {
          downsampledRow.push(pixel);
        }
      }
      
      // Only add the row if it has content
      if (downsampledRow.length > 0) {
        downsampledArt.push(downsampledRow);
      }
    }
    
    return downsampledArt;
  }

  async loadAsciiArt(toolName, mode) {
    const cacheKey = `${mode}-${toolName}`;
    
    // Return cached version if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Apply spelling variations
    const applySpellingVariations = (name) => {
      const variations = [name];
      
      // Handle gray/grey variations
      if (name.includes('grey')) {
        variations.push(name.replace(/grey/gi, 'gray'));
      }
      if (name.includes('gray')) {
        variations.push(name.replace(/gray/gi, 'grey'));
      }
      
      return variations;
    };

    // Try multiple file name variations with spelling alternatives
    const baseVariations = [
      toolName.toLowerCase().replace(/\s+/g, '-'),  // "ida pro" -> "ida-pro"
      toolName.replace(/\s+/g, '-'),               // "IDA Pro" -> "IDA-Pro"  
      toolName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('-'),                                  // "IDA Pro" -> "Ida-Pro"
      toolName.toUpperCase().replace(/\s+/g, '-'), // "IDA Pro" -> "IDA-PRO"
      // Additional mixed case variations
      toolName.split(' ').map((word, index) => 
        index === 0 ? word.toUpperCase() : word.toLowerCase()
      ).join('-'),                                  // "IDA Pro" -> "IDA-pro"
      toolName.split(' ').map((word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).join('-'),                                  // "IDA Pro" -> "ida-PRO"
    ];

    // Apply spelling variations to each base variation
    const allVariations = [];
    baseVariations.forEach(base => {
      allVariations.push(...applySpellingVariations(base));
    });

    // Remove duplicates
    const uniqueVariations = [...new Set(allVariations)];

    for (const fileName of uniqueVariations) {
      try {
        const asciiPath = `/ascii/${mode}/${fileName}.json`;
        
        const response = await fetch(asciiPath);
        
        if (response.ok) {
          const asciiData = await response.json();
          
          // Apply downsampling to optimize display size (1/4th of original)
          const downsampledData = this.downsampleAscii(asciiData);
          
          // Cache the downsampled result for future use
          this.cache.set(cacheKey, downsampledData);
          
          return downsampledData;
        }
        
      } catch (error) {
        // Continue to next variation
      }
    }

    // If all variations failed, return fallback
    console.warn(`Failed to load ASCII art for ${toolName} with any file name variation`);
    return this.getFallbackAscii(toolName);
  }

  getFallbackAscii(toolName) {
    const fallbackLines = [
      '┌─────────────────────┐',
      '│                     │',
      '│    ASCII NOT        │',
      '│    AVAILABLE        │',
      '│                     │',
      `│    ${toolName.toUpperCase().padStart(8).padEnd(8)}    │`,
      '│                     │',
      '└─────────────────────┘'
    ];
    
    const fallbackArt = [];
    fallbackLines.forEach(line => {
      const row = [];
      for (let char of line) {
        row.push({ char, color: '#ffaa00' });
      }
      fallbackArt.push(row);
    });
    
    return fallbackArt;
  }

  // Preload ASCII art for better performance
  async preloadAsciiArt(toolNames, mode) {
    const promises = toolNames.map(toolName => 
      this.loadAsciiArt(toolName, mode).catch(error => {
        console.warn(`Failed to preload ${toolName}:`, error.message);
        return null;
      })
    );
    
    await Promise.all(promises);
  }

  // Clear cache if needed
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export a singleton instance
export const asciiLoader = new AsciiLoader(); 