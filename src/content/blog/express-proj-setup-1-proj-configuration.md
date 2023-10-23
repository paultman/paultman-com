---
title: "Express Proj Setup: 1 Proj Configuration"
pubDatetime: 2022-01-13T15:33:05.569Z
categories:
  - "tech"
tags:
  - "configuration"
  - "nodejs"
ogImage: "/assets/express-proj-setup-1-proj-configuration_cover.png"
description: "An article outlining different node enviroments, how to set them, and use cases for each."
---

Zero to complete, a step-by-step guide to setting up an Express project from a vet

This is part of an ongoing series of articles for setting up a full client/server Express based node application.

- 0: Environment Setup, Eslint, Airbnb style guide, Prettier
- **1: Project Configuration, Node env vs Project env**
- 2: Middleware, Logging: Winston & Morgan
- 3: Data Storage: Native Mongodb
- 4: Authentication: Middleware & Secure Cookies
- 5: Testing: Jest and Supertest
- 6: Code Documentation: JsDoc
- 7: Client JS bundling, Rollup

Code is available at [github](https://github.com/paultman/full-express-setup) and is tagged at each stage of development.

## 1: Project Configuration

Every project will need values like db settings, log file locations or testing configuration, etc. Rather that being hard coded into your project, they should be abstracted into a config file. This leads to a more scalable project, with configuration in a single place, and the separation of configs and code itself.

A common way to access configuration values is via environment values or by local configuration files. Node exposes environment values with a reference to "process.env\[key\]." We will focus on getting values into that env hash.

Before looking at implementation details, there are two often confused settings to discuss. App configuration vs which "mode" node itself is run in. Part of the problem is that they both can use "process.env," but hey are two different things and thus need to be set/managed separately.

process.env.Node ENV refers to the mode you start your app in. For example: In production mode, only _dependencies_ are installed and the server starts in an optimized configuration (more caching, less logging, etc). In non-production mode, _devDependencies_ are loaded, view templates re-rendered on each request, etc. In addition, often NPM modules check this setting for their own optimization or lack thereof (ie debugging mode).

The problem is that developers often overload its use to also determine what environment configuration values to use. So using "process.env.NODE_ENV" to determine which app configuration to use, in actually use, to determine the node mode, the conditional is === or !== "production." Thus "staging," "productionTest", etc will have node run in development mode which might not be the expected/desired mode.

As per a suggestion on [stackoverflow](https://stackoverflow.com/questions/42523175/using-node-env-with-multiple-environments-in-javascript-projects) I follow the use of APP_ENV to differentiate the two settings and allow for more granularity in configuration. As per the aforementioned post, I will typically set each either via shell env variables or via the command line when running package.json scripts.

```json
"scripts": {
  "start:local": "NODE_ENV=development APP_ENV=local node server.js",
  "start:staging": "NODE_ENV=production APP_ENV=staging node server.js",
  "start:live": "NODE_ENV=production APP_ENV=live node server.js",
}
```

Ok, now that we understand the difference, we can focus on app configuration. Typically there are two types of configuration values: general config like which port to run your app, and sensitive configuration, like the production database password.

For general configuration, rather than use an NPM package, which I find overkill and is not as easy to maintain and use when debugging, I opt for a simple JS file which exports a JSON config object based on the APP_ENV setting discussed above.

For sensitive config values, I take those from the process environment (process.env.\[sensitiveValue\]). Unlike the general config, they should not be checked into version control, and are flexible enough to be read from various sources, like the command line, the shell environment, or from another config file, via [dotenv](https://github.com/motdotla/dotenv). For local development I will typically have a .env file for the values, while in production I might have them defined as environment variables.

For example:

```javascript
// config.js
const env = process.env.APP_ENV; // 'prod', 'dev'

const dev = {
app: {
env,
port: 3000
},
db: {
host: 'localhost',
port: 27017,
name: 'db',
username: process.env.db.username || "admin",
password: process.env.db.password || "password"

},
log: {
level: "info"
}
};

const prod = {
app: {
env,
port: 3000
},
db: {
host: '54.82.34.81',
port: 27018,
name: 'prodDB',
username: process.env.db.username,
password: process.env.db.password
}
};

const config = {
dev,
test
};

module.exports = config\[env\];
```

You can find all changes since the last post [here](https://github.com/paultman/full-express-setup/compare/v1.0...v1.1) on github.

In the [next article](express-proj-setup-2-logging-using-winston-amp-morgan), I'll show you a few middleware libraries to add logging to your expressjs backend system.

## References

[https://nodejs.dev/learn/nodejs-the-difference-between-development-and-production](https://nodejs.dev/learn/nodejs-the-difference-between-development-and-production)

[https://codingsans.com/blog/node-config-best-practices](https://codingsans.com/blog/node-config-best-practices)

[https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/configguide.md](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/configguide.md)

[https://www.tatvasoft.com/blog/node-js-best-practices/](https://www.tatvasoft.com/blog/node-js-best-practices/)
