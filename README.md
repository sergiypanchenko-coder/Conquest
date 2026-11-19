# Conquest

Hold the line across thirteen centuries. A free browser tower-defence campaign through 34 real battles, from Covadonga (722) to Barisha (2019): 25 historical soldiers, 5 bosses, a campaign map and music that never repeats.

- `index.html`: the website (home page)
- `play.html`: the game (one self-contained file, canvas, no build step)
- `img/`: screenshots and soldier/boss portraits, drawn from the game's own art
- `vercel.json`: static hosting settings (clean URLs, so `/play` serves `play.html`)
- `supabase/`: the database schema for the Hall of Commanders and worldwide battle stats

## Run locally

Any static server works, e.g. `npx serve .` then open http://localhost:3000.

## Online features

The game talks to a Supabase project through four database functions (`conquest_submit`, `conquest_top`, `conquest_battle_result`, `conquest_battle_stats`). The tables are locked by row-level security; only those functions can read or write them. The publishable key in the code is meant to be public. Everything works offline too: progress is always saved in the browser.

## Releasing

Run `tools/stamp.sh` before each commit that changes the game. It writes a new version into
`play.html` and `version.json`; installed home-screen apps notice the difference and update
themselves (instantly on the map, after the battle if one is in progress), so nobody has to reinstall.
