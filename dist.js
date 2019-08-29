const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.static('./dist',{
    index:false
}))

app.get('/', function (req, res) {
    fs.readFile('./dist/index.html',{encoding : 'utf-8'},function(err,data){
        console.log(data)
        res.send(data)
    })
})
module.exports =app;