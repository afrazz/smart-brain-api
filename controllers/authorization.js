const redisClient = require('./databaseController/databaseController').redisClient;


const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    
    if(!authorization) {
        return res.status(401).json('Unauthorized')
    }
     redisClient.get(authorization, (err, reply) => {
        if(err || !reply) {
            console.log(err)
            return res.status(401).json('Unauthorized')
        }
        return next()
    })  
}

module.exports = {
    requireAuth
}