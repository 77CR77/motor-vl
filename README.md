# MOTOR-VL — Website Redesign

Coursework project: a redesign of a used-Japanese-outboard-motor dealer's website
(Vladivostok, Russia). Fully static site built with plain HTML/CSS/JavaScript — no
frameworks, no build step. Each page is self-contained and can be opened directly
in a browser.

**Live demo:** https://sprightly-panda-5bb1d0.netlify.app

## Business objectives

The redesign was driven by concrete business goals, not just visual polish:

- **Increase sales** by making the buying path shorter and removing friction between browsing and ordering.
- **Attract new clients** with a modern, trustworthy first impression instead of the outdated original site.
- **Build customer trust** through clear, transparent information about the company, pricing, and delivery terms.
- **Grow social media following** by surfacing Instagram, VK, and Telegram prominently on every page.
- **Give customers fast, convenient access to the product catalog**, with brand filters and sorting by price.
- **Simplify communication between the company and clients** via a minimalist, intuitive interface anyone can navigate — including an older, less tech-savvy audience.
- **Streamline staff workflow**, since adding a new motor or updating specs only requires editing one structured data file, no CMS training needed.

## Stack

- HTML5, CSS3 (no preprocessors), vanilla JavaScript (ES5-compatible)
- Responsive layout with a dedicated, separately tuned mobile version (760px breakpoint)
- Manrope font (Google Fonts)

## Structure

```
motor-vl/
├── index.html          Home page
├── catalog.html         Motor catalog with brand filters and sorting
├── delivery.html         Delivery & payment terms
├── contacts.html         Contacts and social links
├── order.html            Order request form
├── css/style.css         All site styles
├── images/logo.png       Site logo
├── media/<id>/images/    Motor photos: /thumb/ — 300x400 previews for cards,
│                         the folder itself — 900x1200 originals for the lightbox
├── media/<id>/video/     Technical-condition clips (not in git)
├── media/<id>/video/poster/  Cover frames for the clips (in git, ~44 KB each)
├── data/video-meta.json  Cover path + duration per clip
├── tools/serve.py        Local server with Range support (video seeking)
├── data/specs-extra.json Specs moved out of the 11-point template (restorable)
└── js/
    ├── catalog-data.js   Catalog data (motor list, prices, specs)
    ├── catalog.js        Catalog logic — filtering, sorting, card rendering
    ├── main.js            Shared scripts — nav menu, lightbox, counters
    └── order.js           Order form handling
```

## Adding a motor to the catalog

Every motor is defined in `js/catalog-data.js` — one object per motor inside the
`MOTORS` array (brand, title, price, photos, videos, specs). To add a new one,
copy an existing block and update the values. See the in-file comments for details.

## Lightbox

Clicking a photo opens it nearly full-screen. From 900px up the box is two columns —
the photo on the left, the caption / thumbnails / video tiles as a right-hand column.
Motor photos are almost always vertical, so a full-width stage left huge empty margins
and a 1400px-wide panel looked broken; as a side column the width earns its keep and the
photo reaches ~91% of the window height. Below 900px the panel goes back under the stage.
«Во весь экран» hides the panel entirely so the image gets the whole window.

Zooming works on photos **and** on a playing video, since the transform is applied to
whichever element is on stage:

- wheel — zoom towards the cursor; click — 250% at the clicked point; click again — back
- drag — pan while zoomed; two-finger pinch on touch screens
- `+` / `−` / `0` on the keyboard, or the on-screen controls
- panning is clamped so the image can never be dragged off into empty space

While a video plays the zoom controls move to the top-left corner — the bottom belongs to
the player's own buttons.

## Motor specifications

Every motor carries the same 11 specs, always in this order:

| # | Spec | Input in admin |
|---|------|----------------|
| 1 | Год | free text |
| 2 | Состояние | новый / б/у |
| 3 | Тактность | 4-тактный / 2-тактный |
| 4 | Длина ноги | S (381 мм) / L (508 мм) / X (635 мм) |
| 5 | Подъем | гидравлический / ручной / ручной (гидродемпфер) / ручной (демпфер) |
| 6 | Компрессия | free text |
| 7 | Давление масла | free text |
| 8 | Наработка | free text |
| 9 | Управление | дистанционное / румпельное / ручное |
| 10 | Комплект | машинка управления / пульт управления / мультирумпель / без комплекта |
| 11 | Возможность увеличения мощности | до 20 / 40 / 60 / 90 л.с. / нет |

Every dropdown also offers «Другое…», which reveals a free-text field — the list is a
shortcut, not a restriction. Unfilled specs are kept in the data as empty strings and
rendered as a dimmed dash, so the tables line up row-for-row across cards. Parts
(`brand: "parts"`) are exempt: an outboard template makes no sense for a propeller, so
their own specs are left alone and the admin form shows only free-form rows for them.

Specs that fell outside the template were moved to `data/specs-extra.json`, not deleted:

```bash
python3 tools/restore_specs.py                      # вернуть всё
python3 tools/restore_specs.py "Кол-во цилиндров"   # вернуть один параметр
python3 tools/sync_fallback.py                      # после любой правки data/*.json
```

`tools/normalize_specs.py` is the one-off migration that produced this layout.

## Photos

All catalog photos are hosted by this repository — nothing is hot-linked from the
original site anymore. Each motor has its own numeric folder under `media/`, mirroring
the source site's layout:

```
media/38/images/thumb/91M0tfSx.png   300x400  — card preview
media/38/images/91M0tfSx.png         900x1200 — lightbox original
```

Cards render the thumbnail; the lightbox derives the original path from it by dropping
`thumb/` — same name, same extension (see `fullSrc()` in `js/main.js`).
Any photo path that is not local (an absolute URL added through the admin panel, say)
is used as-is.

Videos of technical condition play in the lightbox itself. Each motor's clips live next
to its photos:

```
media/103/video/Zict9POI.mp4    "Запуск двигателя"
```

The label-to-file pairing comes from the source site's own item pages, so a clip labelled
"Компрессия 2 цилиндр" really is that clip — 189 videos across 30 motors. The remaining
21 motors have no videos on the source site either.

Each clip has a cover frame and a duration, so the video list looks like the photo
strip: cover, play badge, running time, title. Covers are generated from the clips
themselves and live in `media/<id>/video/poster/` — at ~44 KB each they *are* committed,
so the published site shows them even without the videos:

```bash
python3 tools/make_posters.py     # обложки + data/video-meta.json
```

The clips themselves are **not** in git (3.3 GB — see `.gitignore`); they sit in the working copy and
are served locally. Publishing the site online will need them in separate storage
(S3/R2/video hosting) with `videos[].url` pointing there — any URL that is not a local
`/media/...` path still falls back to opening the source site's card.

## Development history

The full design history (60 iterations) is preserved in this repository's git log —
from the very first layout to the final adaptive mobile version.

## Author

CR7
