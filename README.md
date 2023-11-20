# AstroPaper 📄

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/github/license/satnaing/astro-paper?color=%232F3741&style=for-the-badge)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)

This is the personal blog of Paul Maneesilasan. It is based on the [Astro](https://astro.build) SSG framework, leveraging [AstroPaper](https://github.com/satnaing/astro-paper), thanks to [Sat Naing](https://satnaing.dev).

Updates:

[fb2efd4](https://github.com/satnaing/astro-paper/commit/fb2efd45eb52557d168616ee8680d912f25ffb33)
Although tags were supported, I also added support for categories.  
I did that by adding a categries folder in src/pages, along with an index.astro and dynatmic [category].astro pages.

I also added that field to front matter of posts, updated the ts post definition, and pulled unique categories from the posts collection. See the commit diff above for details.
