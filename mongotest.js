const express = require('express');
const { MongoClient } = require('mongodb');

const app = express(); // ← これが必要！
const client = new MongoClient('mongodb://localhost:27017');

async function main() {
  try {
    // MongoDBに接続
    await client.connect();
    console.log('MongoDB connected');

    const db = client.db('my-app');

    // テスト用ルート
    app.get('/', (req, res) => {
      res.send('Hello World');
    });

    // サーバー起動
    app.listen(3000, () => {
      console.log('start listening on http://localhost:3000');
    });

  } catch (err) {
    console.error(err);
  }
}

main();