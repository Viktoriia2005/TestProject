
const express = require("express")
const path = require('path')
const app = express()

var PORT = process.env.port || 3000

// View Engine Setup 
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")

app.get("/user/:id/:start/:end", function (req, res) {

    var user_id = req.params['id']
    var start = req.params['start']
    var end = req.params['end']

    console.log("User ID :", user_id);
    console.log("Start :", start);
    console.log("End :", end);
})

app.listen(PORT, function (error) {
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
})