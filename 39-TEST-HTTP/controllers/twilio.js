require('dotenv').config()
const accountSid = process.env.TWILIO_ACC_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
 
const client = require("twilio")(accountSid, authToken);

class TwilioCom {
    
    test() {
        console.log("hello")
    }

    enviarMsg(msg) {
        client.messages.create({
            body: msg,
            // mediaUrl: ["https://www.vmlyrcommerce.com.co/wp-content/themes/yootheme/cache/grafica-aceleracion-c9e260ab.png"],
            from: "whatsapp:+14155238886",
            to: "whatsapp:+573187649307"
        }).then(message => console.log(message.sid))
        .catch(console.error)
    }

}


module.exports = {TwilioCom}