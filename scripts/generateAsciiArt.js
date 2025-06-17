#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { createCanvas } from 'canvas';
import sharp from 'sharp';

class NodeAsciiConverter {
  constructor(characterSet = 'detailed') {
    // Choose character set based on preference
    const characterSets = {
      // Original simple set
      'simple': ' .:-=+*#%@',
      
      // Current detailed set
      'standard': ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
      
      // Enhanced detailed set with more characters
      'detailed': ' .\':^"`,;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhaoveys2374569FUNPTR&8%B@$■',
      
      // Cyberpunk/hacker themed
      'cyberpunk': ' .-=+*#%@░▒▓█▄▀▐▌│┤┐└┴┬├─┼╋╊╉╈╇╆╅╄╃╂╁╀┿┾┽┼┻┺┹┸┷┶┵┴┳┲┱┰┯┮┭┬',
      
      // Unicode extended (more gradual transitions)
      'unicode': ' ·⁚⁛⁜⁝⁞⁺⁻⁼⁽⁾ⁿ₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ■□▪▫▬▭▮▯▰▱▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅●○◎',
      
      // Terminal blocks (great for retro feel)
      'blocks': ' ░▒▓█▄▀▐▌'
    };
    
    this.asciiChars = characterSets[characterSet] || characterSets['detailed'];
    this.characterSet = characterSet;
    
    console.log(`Using '${characterSet}' character set (${this.asciiChars.length} characters)`);
  }

  // Get custom settings for specific images
  getImageSettings(imageName) {
    const customSettings = {
      'postman': { resolutionIncrease: 1.5, whiteBackground: false },
      'crowdstrike': { resolutionIncrease: 1.2, whiteBackground: false },
      'ghidra': { resolutionIncrease: 1.2, whiteBackground: false },
      'trufflehog': { resolutionIncrease: 1.2, whiteBackground: false },
      'thinkst-canary': { resolutionIncrease: 1.2, whiteBackground: false },
      'nmap': { resolutionIncrease: 1.2, whiteBackground: false },
      'bash-bunny': { resolutionIncrease: 1.5, whiteBackground: false },
      'bloodhound': { resolutionIncrease: 1.5, whiteBackground: false },
      'hydra': { resolutionIncrease: 1.2, whiteBackground: false },
      'vx-underground': { resolutionIncrease: 1.5, whiteBackground: false },
      'brakeman': { resolutionIncrease: 1.2, whiteBackground: false },
      'ettercap': { resolutionIncrease: 1.2, whiteBackground: false },
      'Podman': { resolutionIncrease: 1.5, whiteBackground: true },
      'coverity': { resolutionIncrease: 1.0, whiteBackground: true },
      'osquery': { resolutionIncrease: 1.0, whiteBackground: true },
      'evilginx2': { resolutionIncrease: 1.0, whiteBackground: true }
    };

    return customSettings[imageName] || { resolutionIncrease: 1.0, whiteBackground: false };
  }

  async convertImageToAsciiEnhanced(imagePath, options = {}) {
    const {
      width = 120,
      height = 80,
      colored = true,
      contrast = 1.3,
      brightness = 0.2,
      whiteBackground = false
    } = options;

    try {
      console.log(`Converting: ${imagePath}`);
      
      let sharpImage = sharp(imagePath);
      
      // Add white background if specified
      if (whiteBackground) {
        sharpImage = sharpImage
          .flatten({ background: { r: 255, g: 255, b: 255 } });
        console.log(`  → Applied white background`);
      }
      
      // Use Sharp to handle various image formats and convert to buffer
      // Use 'inside' fit to maintain aspect ratio and prevent cropping
      const imageBuffer = await sharpImage
        .resize(width, height, {
          fit: 'inside',          // Maintain aspect ratio, resize to fit inside bounds
          withoutEnlargement: false // Allow enlargement for small images
        })
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      const { data, info } = imageBuffer;
      const { channels, width: actualWidth, height: actualHeight } = info;
      
      const result = [];
      
      // Use actual dimensions returned by Sharp (may be smaller than requested due to aspect ratio)
      for (let y = 0; y < actualHeight; y++) {
        const row = [];
        for (let x = 0; x < actualWidth; x++) {
          const pixelIndex = (y * actualWidth + x) * channels;
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
      
      console.log(`  → Generated ${actualWidth}×${actualHeight} ASCII art (requested ${width}×${height})`);
      return result;
    } catch (error) {
      console.error('Failed to convert image to ASCII (enhanced):', imagePath, error);
      throw error;
    }
  }

  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

async function generateAsciiForDirectory(dirPath, outputDir, converter) {
  try {
    const files = await fs.readdir(dirPath);
    const imageFiles = files.filter(file => {
      const ext = file.toLowerCase();
      return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.webp');
    });
    
    console.log(`Found ${imageFiles.length} image files in ${dirPath}`);
    
    for (const file of imageFiles) {
      const imagePath = path.join(dirPath, file);
      const baseName = path.parse(file).name;
      const outputPath = path.join(outputDir, `${baseName}.json`);
      
      try {
        // Get custom settings for this specific image
        const customSettings = converter.getImageSettings(baseName);
        const baseWidth = 120;
        const baseHeight = 80;
        const adjustedWidth = Math.round(baseWidth * customSettings.resolutionIncrease);
        const adjustedHeight = Math.round(baseHeight * customSettings.resolutionIncrease);
        
        console.log(`  → Using ${customSettings.resolutionIncrease}x resolution (${adjustedWidth}×${adjustedHeight})`);
        if (customSettings.whiteBackground) {
          console.log(`  → Applying white background`);
        }
        
        const asciiData = await converter.convertImageToAsciiEnhanced(imagePath, {
          width: adjustedWidth,
          height: adjustedHeight,
          colored: true,
          contrast: 1.3,
          brightness: 0.2,
          whiteBackground: customSettings.whiteBackground
        });
        
        // Save ASCII data as JSON
        await fs.writeFile(outputPath, JSON.stringify(asciiData, null, 2));
        console.log(`✓ Generated: ${outputPath}`);
        
      } catch (error) {
        console.error(`✗ Failed to process ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
}

async function main() {
  console.log('🎨 ASCII Art Pre-renderer for CyberGuesser');
  console.log('==========================================\n');
  
  // Get character set from command line argument or use default
  const args = process.argv.slice(2);
  const characterSet = args.find(arg => arg.startsWith('--charset='))?.split('=')[1] || 'detailed';
  const testMode = args.includes('--test');
  
  if (testMode) {
    // Test different character sets on a single image
    console.log('🧪 Testing different character sets...\n');
    const testSets = ['simple', 'standard', 'detailed', 'cyberpunk', 'unicode', 'blocks'];
    
    // Find a test image
    const testImage = 'public/tools/nmap.png'; // Use nmap as test
    
    for (const set of testSets) {
      console.log(`\n--- Testing ${set} character set ---`);
      const converter = new NodeAsciiConverter(set);
      
      try {
        const asciiData = await converter.convertImageToAsciiEnhanced(testImage, {
          width: 120,
          height: 80,
          colored: true,
          contrast: 1.3,
          brightness: 0.2,
          whiteBackground: false
        });
        
        // Save test output
        const outputPath = `public/ascii/test-${set}.json`;
        await fs.writeFile(outputPath, JSON.stringify(asciiData, null, 2));
        console.log(`✓ Generated test file: ${outputPath}`);
        
      } catch (error) {
        console.error(`✗ Failed to test ${set}:`, error.message);
      }
    }
    
    console.log('\n🎉 Character set testing complete!');
    console.log('Check public/ascii/test-*.json files to compare results');
    return;
  }
  
  const converter = new NodeAsciiConverter(characterSet);
  
  // Ensure output directories exist
  const outputDirs = ['public/ascii/tools', 'public/ascii/accounts'];
  for (const dir of outputDirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  // Process tools directory
  console.log('Processing tools...');
  await generateAsciiForDirectory('public/tools', 'public/ascii/tools', converter);
  
  console.log('\nProcessing accounts...');
  await generateAsciiForDirectory('public/accounts', 'public/ascii/accounts', converter);
  
  console.log('\n🎉 ASCII art generation complete!');
  console.log('Generated files are saved in public/ascii/');
  console.log(`\n💡 Available character sets: simple, standard, detailed, cyberpunk, unicode, blocks`);
  console.log(`   Usage: npm run generate-ascii -- --charset=cyberpunk`);
  console.log(`   Test mode: npm run generate-ascii -- --test`);
}

main().catch(console.error); 