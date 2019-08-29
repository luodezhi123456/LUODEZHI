const express = require('express')
const fs = require('fs')
const app = express()
app.use('/blog', express.static('./static', {
    index: false
}))
app.use('/dist', express.static('./static', {
    index: false
}))
//后台功能路由
app.use('/blog', require('./blog'))
app.use('/pizza', require('./dist'))
app.use('/canvas', require('./canvas'))
app.use(express.static('./static', {
    index: false
}))

app.get('/', function (req, res) {
    fs.readFile('./static/index.html',{encoding : 'utf-8'},function(err,data){
        console.log(data)
        res.send(data)
    })
})
app.listen(3001)