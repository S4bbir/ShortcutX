# ShortcutX

A Manifest V3 Chrome extension that replaces the New Tab page with a highly customizable shortcut launcher.

## Features

- Unlimited shortcuts with drag-and-drop ordering
- Google-style circular shortcut layout
- Starter shortcuts for Google, YouTube, Facebook, LinkedIn, ChatGPT, and Email
- New shortcuts open in the same tab by default
- Local profile popup with username display and optional uploaded avatar
- Automatic favicons, text icons, custom image URL icons, or uploaded local icon images
- Default shortcut colors that match common site/icon brands, with manual overrides
- Saved groups with add, rename, and delete controls
- Optional group tabs and shortcut sorting
- Search bar with Google, DuckDuckGo, Bing, YouTube, and GitHub engines
- Exact shortcut title search opens the matching shortcut
- Custom columns, icon size, spacing, shape, labels, and page position
- Optional clock and editable top links
- Dark, light, or system theme
- Round color pickers with visible color names
- Accent color, background color, background presets, uploaded/URL background images, and dim overlay
- JSON export/import backup
- Chrome storage with `localStorage` fallback for local preview

## Load In Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder:

   `C:\Users\Sabbir\Desktop\prospex`

Open a new tab after loading it.

## Files

- `manifest.json` registers the Manifest V3 extension and New Tab override.
- `newtab.html` contains the New Tab page shell and settings panel.
- `styles.css` controls the responsive launcher UI and themes.
- `app.js` handles storage, shortcuts, groups, settings, import/export, and search.
- `assets/icon-*.png` are extension icons.
