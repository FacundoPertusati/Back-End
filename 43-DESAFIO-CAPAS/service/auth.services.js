import passport from 'passport';
import LocalStrategy from 'passport-local';
import {
  Strategy as JWTStrategy,
  ExtractJwt,
} from 'passport-jwt';
import User from '../model/user.model.js';
import {JWT_SECRET} from '../config/constants.js';

const localOpts = {
  usernameField: 'email',
};

// Jwt strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('authorization'),
  secretOrKey: JWT_SECRET,
};

const localStrategy = new LocalStrategy(localOpts, async (email, password, done) => {
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return done(null, false);
    } else if (!user.authenticateUser(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    // Identify user by ID
    const user = await User.findById(payload._id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', {
  session: false,
});

export const authJwt = passport.authenticate('jwt', {
  session: false,
});
