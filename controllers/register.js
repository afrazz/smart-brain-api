const jwt = require('jsonwebtoken');
const redisClient = require('./databaseController/databaseController').redisClient;

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            return user[0];
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => Promise.reject('unable to register'));
}

signToken = (email) => {
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'})
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
}

const setAuthId = (user) => {
  console.log(user)
  const { id, email } = user
  const token = signToken(email)
    return setToken(token, id)
      .then(data => {
      return {status: 'success', userId: id, token: token}
    })
    .catch(err => 'Unauthorized');
  
}

const registerAuthentication = (req, res, db, bcrypt) => {
  handleRegister(req, res, db, bcrypt)
  .then(user => user.id && user.email ? setAuthId(user) : Promise.reject('unable to register'))
  .then(session => res.json(session))
  .catch(err => res.status(400).json(err));
}


module.exports = {
  registerAuthentication: registerAuthentication
};


