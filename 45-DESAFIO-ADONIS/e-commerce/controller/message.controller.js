class MessageController {
// usar async await
    find (req, res) {

        res.send(req.params.email)
    }

    send (req, res) {
        res.send("en construcción")
    }

}

export default MessageController