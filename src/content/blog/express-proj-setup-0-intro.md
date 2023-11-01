---
title: "Express Proj Setup: 0 Intro"
postSlug: express-proj-setup-0-intro
pubDatetime: 2021-12-24T15:33:05.569Z
categories:
  - "tech"
tags:
  - "expressjs"
  - "jest"
  - "jsdoc"
  - "mongodb"
  - "morgan"
  - "rollup"
  - "supertest"
  - "winston"
ogImage: "/assets/express-proj-setup-0-intro_cover.png"
description: "Review of setting up a development environment to get started with this expressjs based tutorial using visual studio code."
---

Zero to complete, a step-by-step guide to setting up an Express project from a vet

_Benefit to the reader: After reading this article you will: understand why I'm writing a best practice guide to a common framework like Express, learn what components the guide will have, and you will setup a development environment which your will build on via the steps in upcoming posts._ At the end of the full guide you will have a fully-functional, robust, and efficient web-server.

- [**0: Environment Setup, Eslint, Airbnb style guide, Prettier**](express-proj-setup-0-intro)
- [1: Project Configuration, Node env vs Project env](express-proj-setup-1-proj-configuration)
- [2: Middleware, Logging: Winston & Morgan](express-proj-setup-2-logging-using-winston-and-morgan)
- [3: Data Storage: Native Mongodb](express-proj-setup-3-data-storage-native-mongodb)
- [4: Authentication: Middleware & Secure Cookies](express-proj-setup-4-authentication-middleware-and-secure-cookies)
- [5: Testing: Jest and Supertest](express-proj-setup-5-testing-with-jest-and-supertest)
- [6: Code Documentation: JSDoc](express-proj-setup-6-code-documentation-using-jsdoc)
- [7: Client JS bundling, Rollup](express-proj-setup-7-client-side-js-bundling-with-rollup)

Code is available at [github](https://github.com/paultman/full-express-setup) and is tagged at each stage of development.

## Why?

This is a rewrite of an earlier guide I wrote which I've reorganized and decided to break into atomic units of development. I'm writing this guide, one to have everything in one place, second because one of the virtues of Expressjs is being un-opinionated. It's a lightweight framework and leaves details up to the implementer. Only problem with that is that everyone has an opinion and their own "best" implementation.

In preparation for this article, I've looked at varous setups and while they are all unique, I found each of them lacking. As a dev, who has used the express framework on numerous projects and who has over 20 years of professional dev experience, I'll give you my "best practice" implementation, often with references and reasons behind decisions.

## What?

This guide will implement the important components of a full project. In our example project, we will create a simply todo list implementation. From an end-user view, our app will support multiple users and allow them user to perform CRUD operations on tasks (create, read, update, and delete).

## Initial Setup...

The project will build on the baseline environment i wrote about in [Setup Visual Studio on a New Mac 2021](/posts/setup-visual-studio-code-on-a-new-mac-in-2021/). Specifically follow the section titled, "Per Project Setup using ESLint + Airbnb’s Style guide and Prettier." You can find the Github repo [here](https://github.com/paultman/npm-starter-vcs).

To use the files for your own project, clone the project into a directory with your own project name

```shell
git clone https://github.com/paultman/npm-starter-vcs.git full-express-setup
```

Then, cd into that directory, delete the .git directory (rm -rf .git), update the package.json file and readme.md files to reflect your information/specifics, do a git init to create a new repo, "git add ." to add files in the current working directory to staging and finally git commit -m "initial commit of express setup files" to commit staging to the repo.

If you are going to use the Visual Studio Code editor (recommended), but sure to install the Eslint & Prettier extensions, and you'll be all set.

You should now have the beginnings of your own express repo ready and can get started with the next [article](express-proj-setup-1-proj-configuration), focused on project and environment configuration.
