# Quick Start Guide

Get your Matteo Bal portfolio up and running in 5 minutes!

## Step 1: Add Images (5 minutes)

You need **15 total images**:

1. **1 header image** → `images/header/header.jpg`
2. **6 images for first grid** → `images/grid1/image1.jpg` through `image6.jpg`
3. **1 full-width image** → `images/fullwidth/image1.jpg`
4. **6 images for second grid** → `images/grid2/image1.jpg` through `image6.jpg`
5. **1 full-width image** → `images/fullwidth/image2.jpg`

See `IMAGE-CHECKLIST.md` for the complete list.

## Step 2: Update Contact Info (1 minute)

Open `index.html` and find the contact section (around line 110). Update:

```html
<p class="contact-detail">
    <a href="mailto:matteo@matteobal.com">YOUR-EMAIL@example.com</a>
</p>
<p class="contact-detail">
    <a href="tel:+31612345678">YOUR-PHONE-NUMBER</a>
</p>
```

Also update social media links if needed.

## Step 3: Test Locally (1 minute)

### Option A: Python Server
```bash
cd matteo-bal-portfolio
python -m http.server 8000
```
Open: http://localhost:8000

### Option B: Just open the file
Double-click `index.html` in your file browser (works but some features may be limited)

## Step 4: Check Everything Works

- [ ] Header image displays correctly
- [ ] All 12 grid images show up
- [ ] Both full-width images appear
- [ ] Clicking any image opens the lightbox
- [ ] You can navigate between images in lightbox (arrows/keyboard)
- [ ] Contact section shows at bottom
- [ ] Smooth scrolling works when clicking menu
- [ ] Mobile view looks good (resize browser or check on phone)

## Optional Customizations

### Change the Font
See README.md section "Change Custom Font" - currently using **Cinzel** (elegant serif)

### Change Colors
Edit `styles.css` lines 12-18 (CSS variables)

### Add More Menu Items
Edit navigation in `index.html` lines 15-19

## Deploy Online (Optional)

### Easiest: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag the `matteo-bal-portfolio` folder to their drop zone
3. Done! Get a free URL like `matteobal.netlify.app`

### Other Options
- **Vercel**: Similar to Netlify, drag & drop
- **GitHub Pages**: Free if you use GitHub
- **Traditional Hosting**: Upload via FTP/SFTP

## Common Issues

**Images not showing?**
- Check file names match exactly (case-sensitive!)
- Make sure images are in the right folders
- Check file extensions (.jpg not .jpeg or .JPG)

**Lightbox not working?**
- Make sure you're running from a server (not just file://)
- Check browser console for errors (F12)

**Parallax not smooth?**
- Parallax is disabled on mobile devices (by design)
- Works best on desktop/laptop browsers

## Need Help?

Check the full `README.md` for detailed documentation.

---

That's it! You're ready to showcase Matteo's photography. 📸
