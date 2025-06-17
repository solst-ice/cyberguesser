# cyberguesser

Test your cybersecurity knowledge: Guess tools from their logos converted to ASCII.

## Game Info

1. **Guess Quickly**: You have 5 lives and unlimited time per question
2. **Score Points**: 
   - Answer within 5 seconds → **Critical hit!** (100 points)
   - Answer within 5-20 seconds → **Good guess!** (80 points)
   - Answer after 20 seconds → **Correct!** (60 points)
3. **Use Autocomplete**: Type partial names to see suggestions (shows after 3+ characters) OR use hints for multiple-choice answers
4. **Survive**: Game ends when you lose all 5 lives


### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cyberguesser
```

2. Install dependencies:
```bash
npm install
```

3. Add images to the appropriate folders:
   - **Tools**: Add tool logos to `public/tools/`

4. Generate the image manifest:
```bash
npm run generate-manifest
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to the displayed URL (usually `http://localhost:5173`)

## Adding Images

### Automatic Image Detection

The game **automatically detects** all images in the `public/tools/` and `public/x-pfp/` folders! Simply:

1. Add your images to the appropriate folder
2. Run `npm run generate-manifest` to scan for new images
3. The game will include all detected images

### Supported Image Formats

- `.png`
- `.jpg` / `.jpeg` 
- `.svg`
- `.webp`

### Image Naming Convention

Images are automatically converted from filenames to display names:

- `burpsuite.svg` → "Burpsuite"
- `john-the-ripper.png` → "John The Ripper"
- `owasp.jpeg` → "Owasp"
- `USB-Rubber-Ducky.png` → "USB Rubber Ducky"

### Current Tools Available

The game currently includes **60 cybersecurity tools** from your `/public/tools/` folder including:
- Burpsuite, Nmap, Metasploit, Wireshark, Nessus
- Kali Linux, ZAP, John The Ripper, Hashcat
- Bloodhound, Ghidra, IDA Pro, Maltego
- And more!

Run `npm run generate-manifest` to see the complete list of detected tools.

## Customizing the Game

### Adding New Images

1. Simply add image files to `public/tools/` or `public/x-pfp/`
2. Run `npm run generate-manifest` to regenerate the manifest
3. Restart the dev server - your new images will be included!

### Automatic Build Integration

The build process automatically regenerates the manifest:
```bash
npm run build  # Includes manifest generation
```

### Manual Manifest Generation

```bash
npm run generate-manifest
```

This will:
- Scan both image folders
- Generate `public/image-manifest.json`
- Display a list of all detected images

### Modifying Scoring

Edit the scoring logic in `src/components/QuizGame.jsx` in the `handleAnswer` function:

```javascript
if (elapsed < 5) {
  points = 100  // Critical hit
} else if (elapsed < 20) {
  points = 80   // Good guess
} else {
  points = 60   // Correct
}
```

### Changing Lives

Modify the initial lives count in `src/App.jsx`:

```javascript
const [lives, setLives] = useState(5) // Change 5 to desired number
```

## Built With

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **CSS3** - Styling with gradients and animations
- **JavaScript ES6+** - Modern JavaScript features
- **Node.js** - Build-time image scanning


## 🔧 Development Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production (includes manifest generation)
npm run generate-manifest # Scan folders and generate image manifest
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## Development

```bash
npm install
npm run dev
```

## Deployment to GitHub Pages

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select the "gh-pages" branch
   - Save the settings

Your app will be available at: `https://[your-username].github.io/cyberguesser/`

## Features

- Cybersecurity-themed quiz game
- ASCII art integration
- Terminal-style UI
- Responsive design
