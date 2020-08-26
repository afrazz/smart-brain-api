const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
// const knex = require('knex');
const pgdatabase = require('./controllers/databaseController/databaseController').db;


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

// const db = knex({
//   client: 'pg',
//   connection: process.env.POSTGRES_URI
// });

var whitelist = ['http://localhost:3000', 'http://localhost:3001']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


const db = pgdatabase;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send("It's working") })
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register',  (req, res) => { register.registerAuthentication(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})
app.delete('/signout', auth.requireAuth, (req, res) => { profile.handleProfileSignout(req, res)} )


app.listen(process.env.PORT || 5000, () => {
  console.log('app is running');
})