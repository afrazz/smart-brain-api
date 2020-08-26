const redisClient = require('./databaseController/databaseController').redisClient;

const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name, age, pet})
    .then(resp => {
      if (resp) {
        res.json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json(err))
}

const handleProfileSignout = (req, res) => {
  const { authorization } = req.headers;
  redisClient.del(authorization, function(err, reply) {
    if (err || !reply) {
       res.json("Unable to signout")
    }
    return res.json('Signout successfully');
 })
}


module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleProfileSignout
}

