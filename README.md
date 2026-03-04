# Pixaque Portfolio — Asad Ullah

## Folder Structure

```
pixaque/
├── index.html          ← Main HTML (open this in your browser)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Cursor, filter, scroll animations
└── images/
    ├── web/            ← Put website screenshot images here
    ├── logo/           ← Put logo/branding images here
    └── print/          ← Put print media images here
```

---

## How to Add Your Images

1. Copy your image into the correct subfolder:
   - `images/web/project-name.jpg`
   - `images/logo/brand-name.jpg`
   - `images/print/poster-name.jpg`

2. Open `index.html` in a code editor.

3. Find the portfolio card you want to update. Each card looks like:
   ```html
   <article class="pcard" data-category="web">
     <div class="pcard__thumb pcard__thumb--empty">
   ```

4. On the `<div class="pcard__thumb">`:
   - Add `style="background-image: url('images/web/your-file.jpg')"`
   - Remove the class `pcard__thumb--empty`

5. That's it. The hover zoom, overlay, and filter all work automatically.

---

## How to Update Project Names

Inside each `<article class="pcard">` find the overlay:

```html
<div class="pcard__overlay">
  <p class="pcard__category">Web Design</p>
  <h3 class="pcard__title">Your Project Name Here</h3>
</div>
```

Change the text to match your real project.

---

## How to Host It

**Quickest (free):** Go to https://app.netlify.com/drop
Drag the entire `pixaque/` folder onto the page. Done — live URL in seconds.

**With a custom domain:** After deploying to Netlify, go to Domain Settings
and point your domain (e.g. pixaque.com) to it.

---

## Customisation

| What                  | Where                          |
|-----------------------|--------------------------------|
| Colours / fonts       | `css/style.css` — `:root` vars |
| Your name / bio       | `index.html` — About section   |
| Stats (80+, 5+, 40+)  | `index.html` — Stats section   |
| Contact email / links | `index.html` — Contact section |
| Social links          | `index.html` — Footer          |
