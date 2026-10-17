# Sayan De Karmakar — Portfolio

Pure HTML + CSS + JavaScript (no build step, no frameworks).

## Run it in VS Code
1. File → Open Folder → pick this folder.
2. Install the **Live Server** extension (VS Code will suggest it), then click **Go Live** (bottom-right).
3. Or press **F5** and choose a launch config from `.vscode/launch.json`
   (config 2 starts a Python server automatically; config 4 opens the file directly — music/fonts work best on a server).

## Folder map
```
index.html              page shell (nav, theme switch, modal)
css/style.css           colours (dark + light tokens at the top), hero, buttons, nav, theme switch
css/sections.css        about · education · experience · projects · achievements · hobbies · contact
css/agent.css           the Volt hologram + chat panel
js/data.js              ★ YOUR CONTENT — text, links, images, agent comments (edit this first)
js/core.js              theme switch, music, smooth scroll, background, modal
js/render.js            builds every section from data.js
js/effects.js           hero wheel, carousel, 3D project ribbon, 3D achievements tunnel, tilt
js/agent.js             Volt — cursor-following guide, section docking, chat "brain", guided tour
assets/audio/music.mp3  silent placeholder — replace with your song (same file name)
assets/images/profile/  hero profile frames (step-by-step image animation)
assets/images/projects/ project pictures
assets/images/achievements/  certificate / award pictures (3D gallery)
assets/video/           optional hero/profile video
assets/resume/          your résumé PDF (Download button)
```

## Customise (all in `js/data.js`)
- **LinkedIn / GitHub / email / phone** → `links`, `email`, `phone`. Each Experience card has its own `link`.
- **Profile animation** → drop `frame-01.jpg … frame-NN.jpg` in `assets/images/profile/`, then set `hero.frames.ext`, `count`, `fps`. (Or set `hero.video`.)
- **Music** → replace `assets/audio/music.mp3`. Clicking the round profile photo plays/pauses it.
- **Achievement photos** → put images in `assets/images/achievements/` and change each `image` path. Add/remove entries freely.
- **Projects / Experience / Education / Hobbies** → edit the arrays.
- **Colours** → top of `css/style.css` (`--accent`, `--accent-2`, agent colours `--agent-a/b/c`).
- **Volt's comments** → `agent.sections`; what he understands → the `SECTIONS` / `PROJECT_KEYS` lists in `js/agent.js`.

## Using Volt
Move the cursor — he follows. Rest it on a section and he flies beside the heading, looks up and comments.
Click him, press **/** , or use **Ask Volt** to chat: "show projects", "ev charging project", "dark mode",
"play music", "resume", "linkedin", "tour" (a guided auto-scroll through the whole site; scroll or Esc stops it).
