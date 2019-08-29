// 引入express模块
const express = require('express')
// 初始化express模块的app
const app = express()
//引入bodyParser
const bodyParser = require('body-parser')
// 初始化urlencoded解析器
const urlencodedParser = bodyParser.urlencoded({
    extended: false
})
const MongoControl = require('./tools/databasecontrol').MongoControl
// 初始化文章表
const page = new MongoControl('blog', 'page')
// 初始化存储的集合
const comment = new MongoControl('blog', 'comment')
//引入moment模块处理时间格式
const moment = require('moment')

var Ip = ''
app.get('/getIp', function (req, res) {
    Ip = req.query.Ip
    console.log(Ip)
})
// 前台用户提交评论接口
app.post('/submitComment', urlencodedParser, function (req, res) {

    //获取携带在url中的文章id
    var _id = req.query._id
    var fauthor = req.query.author
    //获取评论内容 email 和content
    var {
        email,
        content
    } = req.body

    //简单的表单验证 ： 不允许为空
    if (!_id || !fauthor) {
        res.send('不允许评论')
        return
    }
    if (!email || !content) {
        res.send('不允许评论')
        return
    }
    //操作评论数据库
    comment.insert({
        fid: _id,
        author: email,
        content: content,
        fauthor: fauthor,
        ffid: _id,
        date: moment().format('YYYY-MM-DD HH-mm-ss'),
        state: 0,
        fabulous: 0,
        Ips: [{
            Ip: '',
            fabulousStatus: 0
        }]
    }, (err, result) => {
        if (err) {
            //如果数据库操作失败，则反500
            res.status(500).send('你发了什么评论把我的服务器干崩了？')
            return
        }
        //成功则重定向到这个文章
        res.redirect(
            '/blog/p?_id=' + _id
        )
    })
})

app.post('/submitReplyComment', urlencodedParser, function (req, res) {
    var ffid = req.query.fid
    var fauthor = req.query.f_author
    var fid = req.query.ffid
    var {
        email,
        content
    } = req.body
    if (!ffid || !fauthor || !fid) {
        res.send('不允许评论')
        return
    }
    if (!email || !content) {
        res.send('不允许评论')
        return
    }
    comment.insert({
        fid: fid,
        author: email,
        content: content,
        fauthor: fauthor,
        ffid: ffid,
        date: moment().format('YYYY-MM-DD HH-mm-ss'),
        state: 0,
        fabulous: 0,
        Ips: [{
            Ip: '',
            fabulousStatus: 0
        }]
    }, function (err, result) {
        if (err) {
            //如果数据库操作失败，则反500
            res.status(500).send('你回复了什么评论把我的服务器干崩了？')
            return
        }
        //成功则重定向到这个文章
        res.redirect(
            '/blog/p?_id=' + fid
        )
    })

})
app.get('/chulizan', function (req, res) {
    var IpsArr = []
    _id = req.query._id
    fs = req.query.fs
    comment.findById(_id, function (err, result) {
        if (err) {
            return res.send('点错了')

        }
        var data = result[0]
        var fid = data.fid
        console.log(data)

        for (var i = 0; i < data.Ips.length; i++) {
            if (data.Ips[0].Ip.length == 0 && data.Ips[0].fabulousStatus == 0) {
                var fabulous = data.fabulous + 1
                console.log('++++++')
                var arr = data.Ips
                arr.push({
                    Ip: Ip,
                    fabulousStatus: 1
                })
                arr.splice(0, 1)
                comment.updateById(_id, {
                    fid: data.fid,
                    author: data.author,
                    content: data.content,
                    fauthor: data.fauthor,
                    ffid: data.ffid,
                    date: moment().format('YYYY-MM-DD HH-mm-ss'),
                    state: data.state,
                    Ips: arr,
                    fabulous: fabulous,

                }, function (err, result) {
                    if (err) {
                        console.log(1111)
                        return
                    }
                })
                break
            } else if (data.Ips[i].Ip == Ip) {
                if (data.Ips[i].fabulousStatus == 1) {
                    console.log(22222)
                    var fabulous = data.fabulous - 1
                    var arr = data.Ips
                    arr.push({
                        Ip: Ip,
                        fabulousStatus: 0
                    })
                    arr.splice(i, 1)
                    comment.updateById(_id, {
                        fid: data.fid,
                        author: data.author,
                        content: data.content,
                        fauthor: data.fauthor,
                        ffid: data.ffid,
                        date: moment().format('YYYY-MM-DD HH-mm-ss'),
                        state: data.state,
                        Ips: arr,
                        fabulous: fabulous,

                    }, function (err, result) {
                        if (err) {
                            console.log(1111)
                            return
                        }
                    })
                    break
                } else if (data.Ips[i].fabulousStatus == 0) {
                    console.log('-------')
                    var fabulous = data.fabulous + 1
                    var arr = data.Ips
                    arr.push({
                        Ip: Ip,
                        fabulousStatus: 1
                    })
                    arr.splice(i, 1)
                    comment.updateById(_id, {
                        fid: data.fid,
                        author: data.author,
                        content: data.content,
                        fauthor: data.fauthor,
                        ffid: data.ffid,
                        date: moment().format('YYYY-MM-DD HH-mm-ss'),
                        state: data.state,
                        Ips: arr,
                        fabulous: fabulous,

                    }, function (err, result) {
                        if (err) {
                            console.log(1111)
                            return
                        }
                    })
                    break
                }
            } else if (i == data.Ips.length - 1) {
                console.log('=======')
                var fabulous1 = data.fabulous + 1
                var arr1 = data.Ips
                arr1.push({
                    Ip: Ip,
                    fabulousStatus: 1
                })
                comment.updateById(_id, {
                    fid: data.fid,
                    author: data.author,
                    content: data.content,
                    fauthor: data.fauthor,
                    ffid: data.ffid,
                    date: moment().format('YYYY-MM-DD HH-mm-ss'),
                    state: data.state,
                    Ips: arr1,
                    fabulous: fabulous1,

                }, function (err, result) {
                    if (err) {
                        console.log(1111)
                        return
                    }
                })
                break
            }
        }
        res.redirect('/blog/p?_id=' + fid)
    })
})
module.exports = app 