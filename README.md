# MOTOR-VL — Website Redesign

Coursework project: a redesign of a used-Japanese-outboard-motor dealer's website
(Vladivostok, Russia). Fully static site built with plain HTML/CSS/JavaScript — no
frameworks, no build step. Each page is self-contained and can be opened directly
in a browser.

**Live demo:** https://sprightly-panda-5bb1d0.netlify.app

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

## Development history

The full design history (60 iterations) is preserved in this repository's git log —
from the very first layout to the final adaptive mobile version.

## Author

CR7
