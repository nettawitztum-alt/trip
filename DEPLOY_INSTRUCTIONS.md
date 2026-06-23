# Austria Trip App – Transfer & Deploy Instructions

## What's in this folder
- `index.html` — the entire app. One file, no build step, no dependencies.

---

## Option A: GitHub Pages (free, same setup as before)

### Step 1 – Create a new GitHub repo
1. Go to github.com → New repository
2. Name it anything (e.g. `austria26trip`)
3. Set it to **Public**
4. Do NOT initialize with README

### Step 2 – Upload the file
1. Click **"uploading an existing file"** on the empty repo page
2. Drag `index.html` into the upload area
3. Commit with message: `initial deploy`

### Step 3 – Enable GitHub Pages
1. Go to repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `root`
4. Click **Save**

### Step 4 – Your URL
After ~1 minute your app is live at:
`https://<your-github-username>.github.io/<repo-name>/`

To update later: just upload a new `index.html` and commit.

---

## Option B: Netlify (even easier, drag & drop)

1. Go to [netlify.com](https://netlify.com) → sign up free
2. Drag the entire `austria-trip-transfer` folder onto the Netlify dashboard
3. Done — you get a URL like `https://random-name.netlify.app`
4. You can set a custom name in Site Settings

---

## Option C: Run locally (no internet needed)

Just open `index.html` directly in any browser — it works offline.
(Weather forecast won't load without internet, everything else works.)

---

## App passcode
The app has a family lock screen. The passcode is whatever was set in the original app.
To reset it: open `index.html` in a text editor, search for `passcode` or `PASS` and update the value.

---

## Customizing content
All trip data is hardcoded in `index.html`. Search for:
- `יום 1` / `יום 2` etc. to find day cards
- `16:30` style times to find timeline items
- `Ferienwelt` to find hotel entries
