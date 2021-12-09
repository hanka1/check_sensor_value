import express from "express"
import path from "path"
import bodyParser from "body-parser"
import config from "./config.js"
import email from "./email.js"

const app = express()
const PORT = 8000
const __dirname = path.resolve()
const url = config.EXPRESS_SERVER_URL

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html' ))
})
app.post("/get_sensors", (req, res) => {
    //todo message format
    //console.log(req.body.device_name)

    email.transporter.sendMail(email.mailOptions(req.body), (error, info) => {
        if (error) {
        console.log(error)
        } else {
        console.log('Email sent: ' + info.response)
        }
    })

})

app.listen(PORT,()=>{
    console.log("Server is running at Port " + PORT)
})