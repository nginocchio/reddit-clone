const passport = require('passport');
import Model from '../models/model';
const usersModel = new Model('users');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    usersModel
      .one(jwt_payload.sub)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid credentials' });
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);
