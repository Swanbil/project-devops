const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./database');

const ENV = process.env.NODE_ENV;
const PORT = process.env.port || 5000

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/cities', require('./api/cities'));
app.use('/api/weather', require('./api/weather'));
app.get('/test', (req, res) => res.json({message:"The api is working !"}));
if (ENV === 'production') {
  app.use(express.static(path.join(__dirname), '../client/build'));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

db.query('SELECT NOW()::timestamp', (err, res) => {
  if (err.error)
    return console.log(err.error);
  console.log(`PostgreSQL connected: ${res[0].now}`);
});

module.exports = app;