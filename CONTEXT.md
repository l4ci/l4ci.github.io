# volkerotto.net

Personal website (Jekyll, GitHub Pages). All site content lives in the Content module — `_data/*.yml` rendered through Liquid includes — so each fact has exactly one home.

## Language

**Content module**:
The `_data/` directory plus the Liquid includes that render it. Its interface is the YAML schemas; pages and llms.txt are call sites.
_Avoid_: content layer, CMS

**Client**:
A brand worked with, shown in the logo slider. One entry in `_data/clients.yml`: name, url, img. Alt text derives from name.
_Avoid_: brand, logo (the logo is the rendering, not the concept)

**CV Entry**:
One station in work or education history. Fields: period (free display string, e.g. "Since 2018"), emoji, title, org, optional url, optional current flag. Rendered twice: HTML timeline and llms.txt.
_Avoid_: job, position, timeline item

**Greeting**:
One word in the typewriter rotation ("Hallo", "Bonjour", …). Lives in `_data/greetings.yml`; crosses to main.js as a JSON `data-greetings` attribute on `#hello`.

**Social Link Group**:
A named list of profile links (`professional`, `personal`) in `_data/social.yml`. The social-links include takes a group name. The imprint's obfuscated contact block is NOT a Social Link Group — it stays hand-written.
_Avoid_: socials, contact links

**Hashtag Set**:
A named list of tags (`professional`, `personal`, `imprint_contact`, `cookie`, `disclaimer`) in `_data/hashtags.yml`, rendered by the hashtags include.
_Avoid_: tags, keywords

**Site Facts**:
Declared biographical facts in `_config.yml` under `site.owner`: start_year (2008 — declared, not derived from CV Entries; the timeline simply doesn't list pre-2010 work), role, company.
_Avoid_: metadata, profile
