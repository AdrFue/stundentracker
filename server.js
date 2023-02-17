const express = require('express');

let db = require('./db.js');
let setDates = require('./setDates.js');
let newEntry = require('./newEntry.js');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  db.qry('SELECT * FROM wochenstunden')
    .then(results => {
      res.render('index', {
        wochen: results
      })
    })
    .catch(error => console.error(error));
})


app.post('/neueStunden', (req, res) => {
  db.qry(newEntry.ne(req.body))
  .then(results => {
    res.redirect('/');
  })
  .catch(error => console.error(error));
});


app.get('/setDates', (req, res) => {
  res.render('setDates')
});

app.post('/setDates', (req, res) => {
  qry = setDates.sd(req.body);
  db.qry(qry)
    .then(results => {
      res.redirect('/setDates');
    })
    .catch(error => console.error(error));
});


app.listen(port, () => {
  console.log(`Server auf Port ${port} gestartet!`)
})