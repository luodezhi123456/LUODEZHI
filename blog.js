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

// 引入cookieparser模块
const cookieParser = require('cookie-parser')

// 引入自己实现的MongoControl模块
const MongoControl = require('./tools/databasecontrol').MongoControl
// 初始化文章表
const page = new MongoControl('blog', 'page')
// 初始化存储的集合
const comment = new MongoControl('blog', 'comment')

//引入ejs做后端渲染
const ejs = require('ejs')

//引入moment模块处理时间格式
const moment = require('moment')


// 为请求添加中间件：解析cookie
app.use(cookieParser())

var Ip = ''
//处理静态文件请求
app.use(express.static('./static', {
    index: false
}))

//后台功能接口的静态文件请求
app.use('/admin', express.static('./static', {
    index: false
}))
//后台功能路由
app.use('/admin', require('./admin'))

app.use('/comment',require('./comment'))
//前台程序相关的接口
// 首页接口
app.get('/', function (req, res) {

    //在page数据库里查找全部文章
    page.find({}, function (err, data) {
        //ejs渲染json文章数据到页面中
        data = arrsort(data)
        ejs.renderFile('./ejs-tpl/index.ejs', {
            data: data
        }, function (error, html) {
            res.send(html)

        })
    })
})
//文章浏览接口
app.get('/p', function (req, res) {
    // 获取前端传入的_id
    var _id = req.query._id
    // 根据_id查询文章
    page.findById(_id, function (err, result) {
        // 如果没有这篇文章，则报404
        if (result.length == 0) {
            res.status(404).send('你来到我的秘密花♂园')
            return
        }
         
        //根据文章的id查询相关评论

        var data = result[0] //id查询肯定只返回一条
        comment.find({
            fid: _id,
            state: 1
        }, function (err, result) {
            //渲染评论
            var result = commentSort(result) 
            ejs.renderFile('./ejs-tpl/page.ejs', {
                data: data,
                comment: result,
            }, function (err, html) {
                res.send(html)
            })
        })
    })
})
app.get('/r', function (req, res) {
    var _id = req.query._id
    page.removeById(_id, function (err, result) {
        if (err) {
            res.status(500).send('点错了')
            return
        }
        res.redirect('/blog')
    })
})
// 前台用户提交评论接口
app.get('/page', function (req, res) {
    var _id = req.query._id
    var clicks = parseInt(req.query.clicks)
    clicks = clicks + 1
    page.findById(_id, function (err, result) {
        var data = result[0]
        page.updateById(_id, {
            sort: data.sort,
            title: data.title,
            author: data.author,
            content: data.content,
            intro: data.intro,
            date: data.date,
            clicks: clicks
        }, function (err, date) {
            if (err) {
                res.send('点击量操作错误')
            }

        })
    })

})
arrsort = function (arr) {
    var i, j, temp
    
    for (i = 0; i < arr.length - 1; i++) {
        for (j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j].clicks < arr[j + 1].clicks) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr
}
commentSort = function (arr) {
    var i, j, temp
    
    for (i = 0; i < arr.length - 1; i++) {
        for (j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j].fabulous < arr[j + 1].fabulous) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr
}
//监听 3000 端口
module.exports =app
