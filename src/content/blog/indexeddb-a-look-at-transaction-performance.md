---
author: Paul
pubDatetime: 2022-08-08T15:33:05.569Z
title: IndexedDB, a Look Transaction Performance
featured: false
categories:
  - tech
tags:
  - indexeddb
  - javascript
  - performance
ogImage: "/assets/indexeddb-a-look-at-transaction-performance_cover.png"
description: "A look at how to speed up multiple client side data writes when using Indexeddb."
---

## Background

I've been working on a webapp, which will support offline access. So, after fetching data from the network, I save it to a local store on the client. In my first request, I was saving just over 600 records, and undoubtedly, the app will need to scale many times more than that.

## Problem

In this case, I'm saving records to [IndexedDB](https://www.paultman.com/from-localstorage-to-indexeddb/) and as a proper database, it supports transactions. That means the ability to group multiple operations, and if one fails, to roll them all back and leave the db in a pre-failed state, cleanly. That ability, while advantageous, can negatively affect performance.

One aspect which I always wondered about was how indexedDB "auto" commits transactions. Here's a [great article](https://andreas-butler.github.io/idb-transaction-commit/EXPLAINER.html#why-an-explicit-commit-function-was-not-initially-shipped) on how it works and why. Basically the agent/browser will auto-commit when there is no way for the transaction to transition from inactive to active state. This is most commonly an occurrence when there are no remaining callbacks tied to a previous get/put request.

You might ask why "auto" commit rather than calling commit explicitly. As the previous article explains, it is to prevent devs from leaving transactions open or holding them open too long. So initially IndexedDB shipped with only auto-commit, no explicit way to call commit. Later that happened, and as mentioned, "auto" commit will stay.

Knowing the overhead of transactions, and being worried about the initial batch of writes, in to the thousands, I looked for a way to write all the records at once, a putAll method. I was surprised not to find a method like that, though a sister "getAll" method existed.

## Solution

After some digging, I found a way to make 1 vs 1000 transaction performance is fairly similar. The improved performance is related to relaxing the "atomic" nature of transactions which I mentioned earlier. If you are certain that your operations are independent from each other, you can explicitly set your transaction object "durability" to relaxed via a property with the same name.

db.transaction('customers', 'readwrite', { durability: 'relaxed' })

## Results

This will make a signification performance increase. Check out these results, each is processing the same number of total records:

Default results with a data size of 100k, split over various batch chunks.

<div class="w-60">

| Batch Size | Time    |
| ---------- | ------- |
| 100        | 27150.8 |
| 1000       | 10298.7 |
| 10000      | 7891.4  |
| 100000     | 7732.5  |

</div>
In the extreme case, 1 huge transaction vs 10k smaller ones for the same amount of data, the difference is 344% faster.

Here are the results with the "relaxed" durability explicitly set:

<div class="w-60">

| Batch Size | Time   |
| ---------- | ------ |
| 100        | 8261.5 |
| 1000       | 8481.8 |
| 10000      | 7841.3 |
| 100000     | 7716.8 |

</div>
In this case, the same 1 huge vs 10k smaller, yields a difference of only 7%.

No surprise the idea to implement [putAll](https://bugs.chromium.org/p/chromium/issues/detail?id=1087927) was dropped by the Chromium developers, since due to "relaxed" durability it's unnecessary.

## Sample Test Code

Below is modified test code based on a script from the Chromium team.

```html
<!doctype html>
<meta charset="utf-8" />
<title>IndexedDB population performance test</title>

<pre id="console"></pre>

<script>
  'use strict';
  const testRelaxed = false;
  function consoleLog(message) {
    const console = document.getElementById('console');
    console.innerText = console.innerText + message + "\\r\\n";
  }

  function createTestData() {
    const data = \[\];
    for (let i = 0; i < 100000; i++)
      data.push({ id: i, value: Math.random() });
    return data;
  }
  const kTestData = createTestData();

  function createDb(db_name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(db_name);
      request.onblocked = reject;
      request.onerror = reject;
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('customers', { keyPath: 'id' });
      };
      request.onsuccess = () => {
        const db = request.result;
        resolve(db);
      };
    });
  }

  function deleteDb(db_name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(db_name);
      request.onsuccess = resolve;
      request.onerror = reject;
      request.onblocked = reject;
    });
  }

  function writeData(db, data, start, count) {
    return new Promise((resolve, reject) => {
    //  const transaction = db.transaction('customers', 'readwrite',
    //                                     { durability: 'relaxed' });
      const transaction = db.transaction('customers', 'readwrite', (testRelaxed)?{ durability: 'relaxed' }:{});

      const store = transaction.objectStore('customers');
      for (let i = 0; i < count; ++i)
        store.put(data\[start + i\]);
      if (transaction.commit)
        transaction.commit();

      transaction.oncomplete = resolve;
      transaction.onerror = reject;
      transaction.onblocked = reject;
    });
  }

  async function testRun(db_name, batch_size) {
    const db = await createDb(db_name);
    const start_time = performance.now();
    for (let i = 0; i < kTestData.length; i += batch_size) {
      await writeData(db, kTestData, i, batch_size);
    }
    const end_time = performance.now();
    db.close();
    await deleteDb(db_name);

    consoleLog("Batch size: "+ batch_size+" Time: "+ end_time - start_time);
  }

  async function runAllTests() {
    await testRun('test1', 100);
    await testRun('test2', 1000);
    await testRun('test3', 10000);
    await testRun('test4', 100000);
  }

  runAllTests();
</script>
```
