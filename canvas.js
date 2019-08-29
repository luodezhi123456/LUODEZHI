const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.static('./static',{
    index:false
}))

app.get('/', function (req, res) {
    fs.readFile('./static/canvas.html',{encoding : 'utf-8'},function(err,data){
        console.log(data)
        res.send(data)
    })
})
module.exports =app;