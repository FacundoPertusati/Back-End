import express from "express"
import jwt from "jsonwebtoken"
import passport from "passport";
import { JWT_SECRET } from "../config/constants.js";
const router = express.Router()
import * as UserController from "../controller/user.controller.js"


class UserRouter {

    start() {
        
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user,
    })
  })
  
  router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          console.log(err)
          const error = new Error('new Error')
          return next(error)
        }
  
        req.login(user, { session: false }, async (err) => {
          if (err) return next(err)
          const body = { _id: user._id, email: user.email }
  
          const token = jwt.sign({ user: body }, 'top_secret')
          return res.json({ token })
        })
      }
      catch(e) {
        return next(e)
      }
    })(req, res, next)
  })
  
  router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({
      message: 'You did it!',
      user: req.user,
      token: req.query.secret_token,
    })
  })


        return router
    }
}

export default UserRouter

  