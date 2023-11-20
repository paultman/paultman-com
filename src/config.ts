import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://www.paultman.com",
  author: "Paul Maneesilasan",
  desc: "Thoughts While on a Randown Walk Toward Happiness",
  title: "Paul's Thoughts",
  ogImage: "",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/paultman",
    linkTitle: ` Paul on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/paulmanees",
    linkTitle: `Paul on Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/paultman",
    linkTitle: `Paul on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/paultman",
    linkTitle: `Paul on LinkedIn`,
    active: true,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@paultmane",
    linkTitle: `Paul on YouTube`,
    active: true,
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/paultman/",
    linkTitle: `Paul on LeetCode`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/paultman",
    linkTitle: `Paul on Twitter`,
    active: false,
  },
];
