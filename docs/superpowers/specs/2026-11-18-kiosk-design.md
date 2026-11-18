# Super Matcha kiosk MVP

Source: user-provided `1조_설계서.pdf`, especially pp. 7–15; user confirmed vanilla JS, repository SEOWOOHYUN/SuperMatcha-Kiosk and 2% rewards.

Implement seven portrait screens: eat in/takeout, six-category menu, options dialog, cart, phone rewards, simulated payment, completion. Preserve #03BD5A green, #EEEEEE gray, #111111 black, #F3D9DC consent panel, condensed English headings, Korean labels, large photos and bottom actions. Desktop centers a 9:16 kiosk; small displays remain usable.

Use native HTML/CSS/JavaScript and small model/view/controller modules. No runtime libraries, backend, real charge, administrator interface or rewards redemption. This is the only approach consistent with the supplied design and vanilla-JS request; frameworks/server payment integration are outside this MVP.

Quantity is 1–10 per cart row. Option prices affect line totals. Persist order sequence and consented phone reward balances locally. Credit floor(total * 2 / 100) once on successful checkout. No phone/card data in URLs, logs, repository or external services. Failure keeps cart and allows retry; completion clears current phone and cart and returns home after 10 seconds. Storage failures must not silently claim success. Browser-local data is demonstration data, not a production ledger.

Feature branches stack in order: feat/start-menu → feat/options-cart → feat/payment-order → feat/phone-rewards. No main branch commits or merges. Each feature includes meaningful tests and Conventional Commits. Latest feature contains the full demo.

Prices/options absent from the PDF are sample data, clearly documented. Official menu photos and fonts may need network access until local assets can be obtained. Use reference assets for coursework only.
