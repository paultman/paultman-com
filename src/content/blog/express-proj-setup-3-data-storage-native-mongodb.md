---
title: "Express Proj Setup: 3 Data Storage, Native Mongodb"
postSlug: express-proj-setup-3-data-storage-native-mongodb
pubDatetime: 2022-01-17T15:33:05.569Z
categories:
  - "tech"
tags:
  - "express"
  - "mongodb"
ogImage: "/assets/express-proj-setup-3-data-storage-native-mongodb_cover.png"
description: "Setup a backend database to save data using MongoDB, a non-sql / document based database."
---

Zero to complete, a step-by-step guide to setting up an Express project from a vet

This is part of an ongoing series of articles for setting up a full client/server Express based node application.

- [0: Environment Setup, Eslint, Airbnb style guide, Prettier](express-proj-setup-0-intro)
- [1: Project Configuration, Node env vs Project env](express-proj-setup-1-proj-configuration)
- [2: Middleware, Logging: Winston & Morgan](express-proj-setup-2-logging-using-winston-and-morgan)
- [**3: Data Storage: Native Mongodb**](express-proj-setup-3-data-storage-native-mongodb)
- [4: Authentication: Middleware & Secure Cookies](express-proj-setup-4-authentication-middleware-and-secure-cookies)
- [5: Testing: Jest and Supertest](express-proj-setup-5-testing-with-jest-and-supertest)
- [6: Code Documentation: JSDoc](express-proj-setup-6-code-documentation-using-jsdoc)
- [7: Client JS bundling, Rollup](express-proj-setup-7-client-side-js-bundling-with-rollup)

Code is available at [github](https://github.com/paultman/full-express-setup) and is tagged at each stage of development.

## Data Storage: Native Mongodb

Now that we have a way to store project configuration, lets setup something that will be using it, our database. Since the move to javascript on the server-side via Nodejs, another trend has been the move away from formal schema based SQL based databases to dynamic, document based data stores which follow the familiar JSON structure, which client side developers are accustomed to.

You can find many articles comparing the differences, however for this one, it's assumed you want to use a document-based db, and choose one of the most popular ones, Mongodb.

First Install mongodb, you can find the instructions on their [webpage](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/). In my case, i’m using an M1 mac, and already have x-code command line tools installed, so I’ll using tap and install with brew.

```shell
> brew tap mongodb/brew
> brew install mongodb-community@5.0
```

As per the docs, i’m going run it as a service, and since i’m a lazy programmer, I’ll make an alias in my .zshrc:

```shell
alias mongoDBStart='brew services start mongodb-community@5.0'
alias mongoDBStop='brew services stop mongodb-community@5.0'
```

Therefore, after running “mongoDBStart”, you can check the status with “brew services list”

Now to install the native mongo driver for our express template. If you’re wondering why I’m not using an ODM like Mongoose, there are many reasons for this. First, mongodb is already document oriented so working with it is easy, second it’s less performant, and last, I have more control over exactly what’s happening using the native driver. If you’re still not convinced, have a look at this reddit [discussion](https://www.reddit.com/r/node/comments/b1k1nt/mongodb_with_or_without_mongoose/ein4kju/?utm_source=reddit&utm_medium=web2x&context=3) from two years ago.

Ok, back to installing the native mongodb [driver](https://docs.mongodb.com/drivers/node/current/):

```shell
> npm install mongodb
```

With MongoDB installed locally, and our native mongodb driver installed to our project we will integrated it into our project. Currently we start our server script which calls our express app to start our web server. Since our webserver will depend on a connected database, we will provision that first, and pass it when we initialize our express app. We will also add configuration settings to be read when setting up our db connection.

Rather than putting all our database code in its own file, likely in the lib directory, we will just directly put the code in server.js for simplicity.

```javascript
// server.js
const { MongoClient } = require("mongodb");
const appConfig = require("./config/app");
const logger = require("./lib/logger");
const app = require("./app");

const localMongoURI = `mongodb://${appConfig.db.host}:${appConfig.db.port}/?maxPoolSize=20&w=majority`;
const mongoClient = new MongoClient(localMongoURI);
const db = mongoClient.db(appConfig.db.name);

(async function start() {
  app.init(appConfig, logger, db);
  app.listen(appConfig.app.port, () => {
    logger.info(`Server listening at http://localhost:${appConfig.app.port}`);
  });
})();
```

You can see we import the mongodb driver we just installed. We then setup the url we will be using to connect, create a db client, and select the database as defined in our application file.

Currently we do not do anything with our database, but in the [next step](express-proj-setup-4-authentication-middleware-and-secure-cookies) we will add a users controller and add code to register new users and allow existing ones to login.
