const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const client = new MongoClient('mongodb://localhost:27017');

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function startServer() {

  try {

    await client.connect();
    console.log('MongoDB connected');

    const db = client.db('my-app');

    /*GET*/
    app.get('/', async (req, res) => {

      try {

        const records = await db
          .collection('weight')
          .find()
          .sort({ date: 1 })
          .toArray();

        res.render('index', { records });

      } catch (e) {

        console.error(e);
        res.status(500).send('Internal Server Error');

      }

    });

    /*POST/api/weight*/
    app.post('/api/weight', async (req, res) => {

      const date = req.body.date;
      const weight = req.body.weight;

      if (!date || !weight) {
        return res.status(400).send('Bad Request');
      }

      if (typeof date !== 'string') {
        return res.status(400).send('date must be string');
      }

      try {

        await db.collection('weight').insertOne({
          date: date,
          weight: weight
        });

        res.status(200).send('Created');

      } catch (e) {

        console.error(e);
        res.status(500).send('Internal Server Error');

      }

    });

    /*DELETE /api/weight/:date*/
    app.delete('/api/weight/:date', async (req, res) => {

      const date = req.params.date;

      try {

        const result = await db
          .collection('weight')
          .deleteOne({ date: date });

        if (result.deletedCount === 0) {
          return res.status(404).send('Not Found');
        }

        res.send('Deleted');

      } catch (e) {

        console.error(e);
        res.status(500).send('Internal Server Error');

      }

    });

    /*サーバー起動*/
    app.listen(3000, () => {

      console.log('Server running on http://localhost:3000');

    });

  } catch (err) {

    console.error(err);

  }

}

startServer();