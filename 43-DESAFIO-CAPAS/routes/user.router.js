import express from "express"
import validate from 'express-validation';
import userValidation from '../controller/user-validations.controller.js'
import {
    authLocal,
  } from '../service/auth.services.js';

const router = express.Router()
import * as UserController from "../controller/user.controller.js"


class UserRouter {
// validate(userValidation.signup), desactivado
    start() {
        router.post('/signup',  UserController.signUp);
        router.post('/login', authLocal, UserController.login);


        return router
    }
}

export default UserRouter

  