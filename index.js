const express = require("express");
const app = express();
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");
const { render } = require("ejs");

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1234',
    database : 'project'    
})

app.set("views", __dirname+"/views");
app.set("view engine", "ejs")

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.use(
    session({
        secret : "dsefssgd",
        resave : false,
        saveUninitialized : true,
        maxAge : 360000000
    })
)

app.get("/", function(req, res){
    if(!req.session.logged){
        res.render("login")
    }else{
        res.redirect("/main")
    }
})

app.post("/login", function(req, res){
    var id = req.body._id;
    var password = req.body._password;
    console.log(id, password);
    connection.query(
        `select * from user where id=? and password=?`,
        [id, password],
        function(err, result){
            if(err){
                console.log(err)
                res.send("login SQL select Error")
            }else{
                if(result.length>0){
                    req.session.logged = result[0];
                    res.redirect("/main")
                }else{
                    res.redirect("/")
                }
            }
        }
    )
})

var id=0;

app.get("/main", function(req, res){
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select * from monitoring`,
            function(err, result){
                if (err){
                    console.log(err)
                }else{
                    res.render('main', {
                        'monitor' : result
                    })
                }
            }
        )
    }
})

app.get("/now_update", function(req, res){
    id = req.query._id
    connection.query(
        `select * from monitoring where monitor_id=`+id,
        function(err, result){
            if (err){
                console.log(err)
            }else{
                res.json({
                    "monitor" : result[0]
                })
            }
        }
    )
})
app.get("/defect", function(req,res){
    if(!req.session.logged){
       res.redirect("/")
    }else{
        connection.query(
            `select A.monitor_id, A.time, A.mold_temp, A.melt_temp, A.injection_speed, A.hold_pressure, A.injection_time, A.hold_time, 
            A.filling_time, B.cause from monitoring A, defect B where A.monitor_id=B.monitor_id and A.monitor_id <= `+id,
            function(err,result){
                if(err){
                    console.log(err)
                }else{
                    res.render("defect",{
                        'defect' : result
                    });
                }
            }
        )
    }
})


app.listen(3000, function(){
    console.log("monitor server start")
})
