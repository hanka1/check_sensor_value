import express from "express"
import path from "path"

const app = express()
const PORT = 8000
const __dirname = path.resolve()

app.use(express.static(__dirname + '/public'))

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html' ))
})

app.listen(PORT,()=>{
    console.log("Server is running at Port " + PORT)
})