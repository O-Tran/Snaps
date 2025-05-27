# Looking Cute! - Film Strip Photo App

A retro-styled photo viewing application that turns your videos into beautiful film strip moments. Built with React and styled with a classic film photography aesthetic.

![App Preview](./preview.png)

## 🌟 Features

- **Video to Film Strip Conversion**
  - Record videos directly in the app
  - Upload existing videos
  - Automatic frame extraction with customizable intervals
  - Beautiful film strip presentation

- **Project Management**
  - Create multiple photo projects
  - Swipe-to-delete functionality
  - Organize frames in a grid view
  - Export selected frames as GIFs

- **Retro Film Aesthetic**
  - Classic film strip perforations
  - Yellow frame markers
  - Dancing Script typography
  - Dark theme with film-inspired accents

- **Settings & Customization**
  - Adjustable frame extraction interval (200ms - 10s)
  - Multiple resolution options (low/medium/high)
  - Customizable GIF frame rate (5-30 fps)
  - Light/Dark theme options

## 🚀 Getting Started

### Prerequisites
- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SnapsProj.git
   cd SnapsProj
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 How to Use

### Creating a New Project

1. Click the center "+" button in the bottom navigation
2. Choose between:
   - **Record Video**: Use your device's camera
   - **Upload Video**: Select a video from your device
3. Enter an optional project title
4. Wait for frame extraction to complete

### Managing Projects

- **View Projects**: All projects appear as film strips on the home page
- **Delete Projects**: Swipe left on any project to delete
- **Edit Projects**: Click the edit icon to modify project details
- **View Details**: Click on any project to see all extracted frames

### Working with Frames

1. Open a project to see all extracted frames in a grid
2. Select frames by clicking on them
3. Use the toolbar to:
   - Export selected frames as a GIF
   - Delete selected frames
   - Download all frames as a ZIP

### Customizing Settings

Access settings through the gear icon to adjust:

- **Frame Extraction**
  - Interval between frames
  - Image resolution
  - GIF frame rate

- **Theme**
  - Choose between Light and Dark modes

- **Storage**
  - View storage policy
  - Manage project retention

## 🎨 Design Philosophy

Looking Cute! combines the nostalgia of film photography with modern mobile app convenience. The design features:

- Film strip perforations and markers
- High contrast for readability
- Minimum 44pt touch targets (Apple guidelines)
- Consistent spacing and typography
- Dark theme with yellow accents
- Translucent overlays for depth

## 📝 Technical Notes

- Built with React and TypeScript
- Uses Tailwind CSS for styling
- Implements the Context API for state management
- Follows Apple's Human Interface Guidelines
- Responsive design with fixed phone dimensions (1080x1920px)

## 🔒 Privacy & Storage

- All processing happens locally in the browser
- Projects are automatically deleted after 30 days
- No data is sent to external servers
- Download your images before expiration to keep them permanently

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by classic film photography
- Icons from Lucide React
- Dancing Script font from Google Fonts
- Film strip design inspired by vintage 35mm film 
