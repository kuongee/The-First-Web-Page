var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now() + '-' + file.originalname)
    }
});
var upload = multer({ storage: _storage });

var index = require('./routes/index');
var users = require('./routes/users');
var member = require('./routes/member');

var connection = require('./config/db');
connection.connect();
/*var connection = require('./config/pgdb');
connection.connect();*/

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use('/member', member);

app.get('/', defaultPage);
function defaultPage(req, res) {
    res.sendFile(__dirname + '/public/index.html');
}

app.post('/upload', upload.single('userfile'), function(req, res) {
    var message = {};
    console.log("Image name " + req.file.filename);
    message.path = req.file.filename;
    save(message, "image", res); 
});

app.get('/show.json', function(req, res) {
    var id = req.query.id;
    //console.log("id is " , id);
    show(id, "image", res);
});

app.get('/delete.json', function(req, res) {
    var id = req.query.id;
   // console.log("id is " , id);
    deleteDB(id, "image", res);
});

app.get('/list.json', function(req, res) {
    var pageNo = req.query.pageNo;
    list(pageNo, res);
});

function save(data, table, res) {
    var sql = `INSERT INTO ` + table + ` SET ?`;
    var query = connection.query(sql, data, function (err, result) {
        var resultObj = {};
        if(err) {
            resultObj.success = false;
        } else {
            resultObj.success = true;
            resultObj.id = result.insertId;
        }
        res.send(JSON.stringify(resultObj));
    });
}

function show(id, table, res) {
    var sql = 'SELECT * from ' + table + ' where id = ';
    var query = connection.query(sql + connection.escape(id), function (err, result){
        var resultObj = {};
        if(err) {
            resultObj.success = false;
        }
        else {
            res.json(result);
            return;
        }
        res.send(JSON.stringify(resultObj));
    });
}

function deleteItem(id, table) {
    var selec = 'SELECT path from ' + table + ' where id = ';
    connection.query(selec + connection.escape(id), function(err, result) {
        var fullpath = path.join(__dirname, 'public', 'uploads', result[0].path);
        fs.unlink(fullpath, function(error) {
            if(error) {
                throw error;
            }
            console.log("local file deleted successfully");
            return;
        });
    });

}

function deleteDB(id, table, res) {
    deleteItem(id, table);
    var sql = 'delete from ' + table + ' where id=';
    var query = connection.query(sql + connection.escape(id), function (err, result) {
        var resultObj = {};
        if(err) {
            resultObj.success = false;
        }
        else {
            resultObj.success = true;
            //return;
        }
        console.log("here");
        res.send(JSON.stringify(resultObj));        
    });

}

function list(pageNo, res) {
    console.log(pageNo);
    var num = parseInt(pageNo) - 1;
    if(num < 0) {
        num = 0;
    }
    var query = connection.query('select * from image order by id desc limit ?, ?', [num * 3, 3], function(err, results) {
        var resultObj = {};
        if(err){
            resultObj.success = false;
            console.log(err);
        }
        else {
            resultObj.success = true;
            resultObj.list = results;
            //res.json(resultObj);
            count(res, resultObj);
            return;
        }
        res.send(resultObj);
    });
}

function count(res, list) {
    var query = connection.query('select count(*) as count from image'
                                 , function (err, results) {
        var resultObj = list;
        if (err) {
            resultObj.success = false;
            console.log(err);
        } else {
            resultObj.count = results[0].count;
            resultObj.perpage = 3;
            res.json(resultObj);
            return;
        }
        res.send(resultObj);
    });
  }

/*app.post('/upload', upload.single('userfile'), function (req, res) {
    connection.query(`insert into image (id, path)
    values (null, ?)`, [req.file.filename],
        function (error, results, fields) {
            if (error) throw error;
        });

    connection.query('SELECT path from image', function (error, results, fields) {
        if (error) throw error;
        var html = showImages(results)        
        res.send(html);
    });

});
*/

app.post('/text', function (req, res) {
    var text = req.body.text;
    res.send(text);
});

app.get('/show', function (req, res) {
    connection.query('SELECT path from image', function (error, results, fields) {
        if (error) throw error;
        var html = showImages(results)        
        res.send(html);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


//connection.end();

/*
'use strict';
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //smtp.daum.net
    port: 465,  // 465
    secure: true, // true for 465, false for other ports
    auth: {
        user: '',  
        pass: ''     
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"kuongee" <kuongee@naver.com>', // sender address
    to: 'kuongee@gmail.com', // list of receivers
    subject: 'Node-emailer 연습입니다!', // Subject line
    text: '안녕하세요! 민지수입니다. Node-emailer 연습 메일입니다! 감사합니다. 민지수 드림', // plain text body
    //html: '<b>Hello world?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
*/

module.exports = app;
