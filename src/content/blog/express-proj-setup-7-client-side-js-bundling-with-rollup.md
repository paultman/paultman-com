---
author: Paul
pubDatetime: 2022-02-10T15:33:05.569Z
title: "Express Proj Setup 7: Client-side JS bundling, with Rollup"
slug: express-proj-setup-7-client-side-js-bundling-with-rollup
categories:
  - tech
tags:
  - bundling
  - expressjs
  - rollup
ogImage: /assets/express-proj-setup-7-client-side-js-bundling-with-rollup_cover.png
description: This post shows how to bundle and optimize website resources for distribution using Rollup
---

Zero to complete, a step-by-step guide to setting up an Express project from a vet

This is part of an ongoing series of articles for setting up a full client/server Express based node application.

- [0: Environment Setup, Eslint, Airbnb style guide, Prettier](express-proj-setup-0-intro)
- [1: Project Configuration, Node env vs Project env](express-proj-setup-1-proj-configuration)
- [2: Middleware, Logging: Winston & Morgan](express-proj-setup-2-logging-using-winston-and-morgan)
- [3: Data Storage: Native Mongodb](express-proj-setup-3-data-storage-native-mongodb)
- [4: Authentication: Middleware & Secure Cookies](express-proj-setup-4-authentication-middleware-and-secure-cookies)
- [5: Testing: Jest and Supertest](express-proj-setup-5-testing-with-jest-and-supertest)
- [6: Code Documentation: JSDoc](express-proj-setup-6-code-documentation-using-jsdoc)
- [**7: Client JS bundling, Rollup**](express-proj-setup-7-client-side-js-bundling-with-rollup)

Code is available at [github](https://github.com/paultman/full-express-setup) and is tagged at each stage of development.

# Client JS Bundling, using Rollup

## Background

Ok folks, I've already written a [post](/posts/using-rollup-to-bundle-js-assets/) about javascript bundlers, and specifically Rollup. Please take a look at that post and the respective Github [repo](https://github.com/paultman/rollupExampleProj) for more information about it's benefits and how it's used in detail.

In this post, I will assume you have read this [post](/posts/using-rollup-to-bundle-js-assets/) or are familiar with JS bundlers so I will get right into implementation details for our project.

## Installation

Start by installing Rollup and a few helper plugins:

```shell
npm i rollup rollup-plugin-copy rollup-plugin-postcss rollup-plugin-terser cssnano -D
```

That will install Rollup, a helper to copy files, tenser, postcss, and cssnano plugins as dev dependencies.

## Usage

Now that we will be optimizing our client files, we will compile/copy them to a /dist directory so we will need to update references from /client to /dist. For example, in app.js when calling res.sendfile. We will also add the ability to serve static files from our webserver, assets like images, scripts, and style files. In production, it's advisable to serve these from a dedicated file server like Nginx locally, s3 in the cloud, or from a CDN like CloudFront.

Here's what our updated app.js looks like:

```javascript
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const path = require("path");
const userRoutes = require("./controllers/users");

const app = express();
app.locals.projDir = __dirname;

app.use(
  cookieSession({
    name: "session",
    maxAge: 1000 * 60 * 60 * 24 * 7, // miliseconds from now to expire, 1wk
    httpOnly: true, // unreadable via client JS
    sameSite: "lax", // only sent from same website
    signed: true, // include signature to check tampering
    // secure: true, // must be over https
    keys: ["s3cr3t"],
  })
);

app.init = (config, logger, db) => {
  userRoutes.init(config, logger, db);
  app.use(
    morgan("tiny", {
      stream: {
        write: message => logger.info(message),
      },
    })
  );

  const checkAuth = (req, res, next) => {
    if (!(req.session && req.session.ref)) {
      if (req.headers["x-requested-with"]) {
        res.status(302).send({ url: "/" }); // if request is an ajax request send json back
      } else {
        res.redirect("/"); // do normal 302 redirect
      }
    } else next(); // they have an untampored with token, could further validatate here
  };

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", (req, res) => {
    logger.info(`running in ${config.app.env} environment`);
    res.sendFile(`${__dirname}/dist/index.html`);
  });
  app.get("/home.html", checkAuth, (req, res) => {
    res.sendFile(`${__dirname}/dist/home.html`);
  });

  app.post("/login", userRoutes.login);
  app.post("/register", userRoutes.register);
  app.get("/logout", userRoutes.logout);

  app.use(express.static(path.join(__dirname, "/dist/")));
};
module.exports = app;
```

and to use Rollup, we will setup a config file called rollup.config.js in the app root folder:

```javascript
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import path from "path";

export default {
  input: "client/scripts/index.js",
  output: {
    file: "dist/index.min.js",
    format: "iife",
    sourcemap: process.env.NODE_ENV === "production" ? false : "inline",
    plugins: [process.env.NODE_ENV === "production" && terser()],
  },
  watch: {
    include: "./client/**",
    exclude: "./node_modules/**",
  },
  plugins: [
    postcss({
      extract: "index.min.css",
      plugins: [process.env.NODE_ENV === "production" && cssnano()],
      extensions: [".css"],
    }),
    copy({
      targets: [{ src: ["client/index.html", "client/home.html"], dest: "dist/" }],
    }),
  ],
};
```

You can see that if we are in production mode, we will skip sourcemaps, and will compress our javascript, and css.

Take a look at the github [changes](https://github.com/paultman/full-express-setup/compare/v1.6...v1.7) to index and home html, css, and js files.

## References

[https://www.learnwithjason.dev/blog/learn-rollup-css](https://www.learnwithjason.dev/blog/learn-rollup-css)

[https://dev.to/plebras/setting-up-a-javascript-build-process-using-rollup-n1e](https://dev.to/plebras/setting-up-a-javascript-build-process-using-rollup-n1e)
