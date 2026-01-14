# Matteo Bal - Photography Portfolio

A modern, responsive photography portfolio website with parallax effects and elegant image gallery.

## Features

- **Elegant Header**: Full-screen header with custom typography (Cinzel font) and background image
- **Smooth Navigation**: One-page design with smooth scrolling between sections
- **Responsive Image Grids**: Two 6-image grids (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Full-Width Showcases**: Two full-width hero images with parallax scroll effects
- **Advanced Lightbox**: Click any image to view in full-screen gallery with:
  - Next/Previous navigation
  - Zoom functionality
  - Keyboard controls (arrow keys, ESC to close)
  - Touch/swipe support on mobile
- **Contact Section**: One-pager contact area with email, phone, and social links
- **Parallax Effects**: Smooth parallax scrolling on desktop devices
- **Fully Responsive**: Mobile-first design that works on all devices
- **Performance Optimized**: Lazy loading, smooth animations, GPU-accelerated transforms

## Folder Structure

```
matteo-bal-portfolio/
├── index.html
├── styles.css
├── script.js
├── README.md
└── images/
    ├── header/
    │   └── header.jpg          (Your main header image)
    ├── grid1/
    │   ├── image1.jpg          (First grid, 6 images)
    │   ├── image2.jpg
    │   ├── image3.jpg
    │   ├── image4.jpg
    │   ├── image5.jpg
    │   └── image6.jpg
    ├── grid2/
    │   ├── image1.jpg          (Second grid, 6 images)
    │   ├── image2.jpg
    │   ├── image3.jpg
    │   ├── image4.jpg
    │   ├── image5.jpg
    │   └── image6.jpg
    └── fullwidth/
        ├── image1.jpg          (First full-width image)
        └── image2.jpg          (Second full-width image)
```

## How to Add Your Images

1. **Header Image**: Place your hero/header image in `images/header/` and name it `header.jpg`
   - Recommended size: 2400x1600px or larger
   - Format: JPG or PNG

2. **Grid Images**: Add 6 images to each grid folder (`grid1/` and `grid2/`)
   - Name them: `image1.jpg` through `image6.jpg`
   - Recommended size: 1200x1500px (4:5 aspect ratio works best)
   - Format: JPG (optimized for web)

3. **Full-Width Images**: Place your showcase images in `images/fullwidth/`
   - Name them: `image1.jpg` and `image2.jpg`
   - Recommended size: 2400x1200px or larger
   - Format: JPG

## Image Optimization Tips

- Compress images before uploading (use tools like TinyPNG, ImageOptim, or Squoosh)
- Target file size: 200-500KB per image for web
- Use JPG for photographs, PNG for graphics with transparency
- Maintain aspect ratios: 4:5 for grid images, 16:9 for full-width images

## Customization

### Change Custom Font

The header uses **Cinzel** font. To change it:

1. Go to [Google Fonts](https://fonts.google.com)
2. Select your preferred font
3. Update the `<link>` tag in `index.html` (around line 9)
4. Update the font-family in `styles.css` for `.hero-title` (around line 86)

Example fonts that work well:
- Playfair Display
- Cormorant Garamond
- Bodoni Moda
- Libre Baskerville

### Update Contact Information

Edit the contact section in `index.html` (around line 110-125):
- Email address
- Phone number
- Social media links (Instagram, LinkedIn, etc.)

### Color Scheme

Edit CSS variables in `styles.css` (lines 12-18):
```css
:root {
    --primary-color: #1a1a1a;      /* Dark sections background */
    --secondary-color: #f5f5f5;    /* Light sections background */
    --text-color: #333;            /* Main text color */
    --light-text: #666;            /* Secondary text color */
    --accent-color: #fff;          /* Accent/highlight color */
}
```

### Menu Items

The navigation menu shows:
- kleur (color)
- zwart/wit (black/white)
- contact

To modify, edit the navigation in `index.html` (lines 15-19). You can:
- Add more menu items
- Link them to different sections using IDs
- Change the text

## Running the Portfolio

### Option 1: Simple Local Server (Recommended)

Using Python:
```bash
cd matteo-bal-portfolio
python -m http.server 8000
```

Then open: `http://localhost:8000`

### Option 2: Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Deploy Online

Upload the entire `matteo-bal-portfolio` folder to:
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect via GitHub or drag & drop
- **GitHub Pages**: Push to GitHub and enable Pages
- **Traditional hosting**: Upload via FTP to your web host

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Grid, Flexbox, Custom Properties, Animations
- **Vanilla JavaScript**: No frameworks needed
- **GLightbox**: Lightweight, beautiful lightbox library
- **Google Fonts**: Cinzel and Inter fonts

## Performance Features

- Lazy loading for images
- GPU-accelerated animations
- Parallax only on desktop (disabled on mobile for performance)
- Intersection Observer for scroll animations
- Optimized scroll handling with requestAnimationFrame

## Keyboard Shortcuts (in Lightbox)

- **Arrow Left/Right**: Previous/Next image
- **ESC**: Close lightbox
- **+/-**: Zoom in/out
- **Spacebar**: Play/pause slideshow

## Mobile Gestures (in Lightbox)

- **Swipe left/right**: Previous/Next image
- **Pinch**: Zoom in/out
- **Double tap**: Zoom to fit
- **Drag**: Pan around zoomed image

## License

This portfolio template is provided as-is for Matteo Bal. Feel free to modify as needed.

## Support

For issues or questions, contact the developer or refer to:
- [GLightbox Documentation](https://github.com/biati-digital/glightbox)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web Performance Tips](https://web.dev/performance/)

---

Built with care for Matteo Bal | 2026
