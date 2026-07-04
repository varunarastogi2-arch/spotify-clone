# 🎧 Spotify Clone

A front-end clone of the Spotify web player built with **HTML, CSS, and vanilla JavaScript**. It replicates the core look and feel of Spotify's UI — sidebar navigation, home/search views, a functional music player with progress/volume control, and a "liked songs" (favorites) system.

## ✨ Features

- **Sidebar navigation** — switch between Home and Search views
- **Home view** — recently played grid and personalized "Made For You" cards
- **Search view** — browse categories (Podcasts, Pop, Hip-Hop, Rock, etc.)
- **Custom audio player**
  - Play / Pause / Next / Previous controls
  - Click-to-seek progress bar with live timestamps
  - Click-to-adjust volume bar with dynamic mute/low/high icons
  - Auto-plays the next track when a song ends
- **Favorites system** — heart a song to add it to a "Fav Ones" list in the sidebar, unheart to remove it
- **Responsive card & grid layouts** styled after Spotify's dark theme

## 🗂️ Project Structure

```
spotify-clone/
├── index.html          # Main markup and layout
├── css/
│   └── styles.css      # All styling (theme, layout, player, cards)
├── js/
│   └── script.js       # Navigation, playback, progress/volume, favorites logic
└── assets/
    ├── song.webm
    ├── bloodline.webm
    ├── be_alright.webm
    ├── laroi_cover.png
    ├── bloodline_cover.png
    └── be_alright_cover.png
```

> **Note:** Update the paths above if your folder layout differs — make sure `assets/`, `css/`, and `js/` sit alongside `index.html` exactly as referenced in the HTML file.

## 🚀 Getting Started

### Prerequisites
Just a modern web browser. No build tools or dependencies required.

### Run locally
1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/spotify-clone.git
   cd spotify-clone
   ```
2. Open `index.html` directly in your browser, **or** serve it locally (recommended, avoids audio autoplay/CORS quirks):
   ```bash
   # Using Python
   python3 -m http.server 5500

   # Using VS Code
   # Right-click index.html → "Open with Live Server"
   ```
3. Visit `http://localhost:5500` in your browser.

## 🛠️ Built With

- **HTML5** — semantic structure and `<audio>` element for playback
- **CSS3** — Flexbox/Grid layout, gradients, custom scrollbars, hover animations
- **Vanilla JavaScript** — DOM manipulation, event handling, dynamic playlist logic
- **[Font Awesome](https://fontawesome.com/)** — icons
- **[Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)** — typography

## 📌 Notes

- This is a **UI/front-end clone for learning purposes only** — it is not affiliated with or endorsed by Spotify.
- Audio tracks and cover art included are placeholder/demo assets used to showcase player functionality; swap them out with your own licensed audio for any public deployment.


## 🙌 Acknowledgements

Inspired by the Spotify web player UI, built as a personal front-end practice project.