const User = require('../models/user'),
      Rank = require('../models/rank'),
    jwt = require('jsonwebtoken');

var moment = require('moment');

var config;
try {
  config = require('../env.json');
}
catch (e) {
  if(e.code === 'MODULE_NOT_FOUND') {
    console.log("CANNOT LOAD env.json");
  }
  config = process.env;
}


function tokenForUser(user, healthBool) {
  const timestamp = new Date().getTime();
  // iat = issued at time
  return jwt.sign({sub: user.id, fullname: user.fullname ,username: user.username ,iat: timestamp, health: healthBool}, config.SECRET_KEY, {expiresIn: '7d'});
  // return jwt.encode({sub: user.id, iat: timestamp}, config.SECRET_KEY);
}




exports.signUp = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const fullname = req.body.fullname;

  if(!username || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }

  User.findOne({username: username}, function(error, existingUser) {
    if (error) {
      return next(error);
    }

    if (existingUser) {
      return res.status(422).send({error: 'Username is in use'});
    }

    const user = new User({
      fullname: fullname,
      username: username,
      password: password,
      heartRate: 0,
      avgSpeed: 0,
      avgDistance: 0,
      rank: 0,
      randomIndex: Math.random(),
      created: moment().unix()
    });

    user.save(function(error) {
      if (error) {
        return next(error);
      }
    
      // var rank = new Rank({
      //   user: user._id,
      //   username: user.username,
      //   fullname: user.fullname,
      //   heartRate: 0,
      //   avgSpeed: 0,
      //   avgDistance: 0,
      //   rank: 0,
      //   randomIndex: Math.random(),
      //   created: moment().unix()
      // })

      // rank.save(function(error) {
      //   if (error) {
      //     return next(error);
      //   }
      // });

      res.json({token: tokenForUser(user, false)});
    });

  });
};

exports.signIn = function(req, res, next) {
  // Give token
  // req.user is from passport done(user)
  console.log(req.user);
  var healthBool = req.user.health === undefined ? false : true;
  res.send({token: tokenForUser(req.user, healthBool)});
};
