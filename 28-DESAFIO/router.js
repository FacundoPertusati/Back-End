const express = require('express')
const router = express.Router()
const passport = require('passport')
const path = require('path')
const { fork } = require('child_process')


router.get('/randoms', (req, res, next) => {
    const childProcess = fork(path.join(__dirname, './child-process.js'))
    childProcess.send({ 'cant': req.query.cant })
    childProcess.on('message', message => {
        res.render('randoms', {
            title: 'Randoms',
            listRandom: message
        })
    })
})

module.exports = router