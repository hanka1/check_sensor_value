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
    console.log(req.body)
    email.sendEmail(req.body)

})

app.listen(PORT,()=>{
    console.log("Server is running at Port " + PORT)
})