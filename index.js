const express = require("express");
const app = express();
const fs = require("fs");
const data = JSON.parse(fs.readFileSync(__dirname + '/db.json'));
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");

const connection = mysql.createConnection({
    host : data.host,
    port : data.port,
    user : data.user,
    password : data.password,
    database : data.database    
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
                    req.session.dir = false
                    req.session.run = false
                    connection.query(
                        `select avg(mold_m) mold_m, avg(melt_m) melt_m, avg(hold_m) hold_m, avg(injection_m) inj_m,
                        avg(mold_s) mold_s, avg(melt_s) melt_s, avg(hold_s) hold_s, avg(injection_s) inj_s
                         from optimum`,
                        function(err, result){
                            if(err){
                                console.log(err)
                            }else{
                                req.session.mold = [parseFloat(result[0].mold_m), parseFloat(result[0].mold_s)]
                                req.session.melt = [parseFloat(result[0].melt_m), parseFloat(result[0].melt_s)]
                                req.session.hold = [parseFloat(result[0].hold_m), parseFloat(result[0].hold_s)]
                                req.session.inj = [parseFloat(result[0].inj_m), parseFloat(result[0].inj_s)]
                                res.redirect("/main")
                            }
                        }
                    )
                    
                }else{
                    res.redirect("/")
                }
            }
        }
    )
})

app.get("/logout", function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Logout session destroy Error")
        }else{
            res.redirect("/")
        }
    })
})

app.get("/time", function(req, res){
    res.json({
        "date" : moment().format("YYYY-MM-DD"),
        "time" : moment().format("HH:mm:ss")
    })
})

var interval;
var id = 46;


app.get("/main", function(req, res){
    console.log("run : "+req.session.run)
    req.session.dir = false;
    var date = moment().format("YYYYMMDD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select * from setup where date(date)=?`,
            [date],
            function(err, result1){
                if(err){
                    console.log(err)
                }else{
                    connection.query(
                        `select *,
                        (select sum(quantity) from ordert where date(date) =`+date+`) total
                         from ordert where date(date)=(select date_format(now(),'%Y-%m-%d') from dual)`,
                        function(err0, result0){
                            if (err0){
                                console.log(err0)
                            }else{
                                if(result0.length==0){
                                    res.render("main",{
                                        'monitor' : result0[0],
                                        'run' : req.session.run,
                                        'linkcode' : req.session.logged.linkcode,
                                        "dir" : req.session.dir,
                                        "melt" : req.session.melt,
                                        "mold" : req.session.mold,
                                        "hold" : req.session.hold,
                                        "inj" : req.session.inj,
                                        "setup" : result1[0]
                                    })
                                }else{
                                    req.session.dir = true;
                                    connection.query(
                                        `select *, (select count(*) from monitoring`+date+`) cnt,
                                        (select count(*) from monitoring`+date+` where defect='N') def
                                        from monitoring`+date+` order by monitor_id desc limit 1`,
                                        function(err, result){
                                            if (err){
                                                console.log(err)
                                            }else{
                                                res.render('main', {
                                                    'monitor' : result[0],
                                                    "run" : req.session.run,
                                                    "linkcode" : req.session.logged.linkcode,
                                                    "dir" : req.session.dir,
                                                    "order" : result0,
                                                    "melt" : req.session.melt,
                                                    "mold" : req.session.mold,
                                                    "hold" : req.session.hold,
                                                    "inj" : req.session.inj,
                                                    "setup" : result1[0]
                                                })
                                            }
                                        }
                                    )        
                                }
                            }
                        }
                    )
                }
            }
        )
        
    }
})

app.get("/main_update", function(req, res){
    var mold = req.session.mold;
    var melt = req.session.melt;
    var hold = req.session.hold;
    var inj = req.session.inj;
    date = moment().format("YYYYMMDD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select *,
            (select count(*) from monitoring`+date+`) cnt, 
            (select sum(quantity) from ordert where date(date) =`+date+`) total,
            (select count(*) from monitoring`+date+` where defect='N') def  
            from monitoring`+date+` order by monitor_id desc limit 1`,
            function(err, result){
                if (err){
                    console.log(err)
                }else{
                    if (req.session.run == false){
                        req.session.run = true;
                        interval = setInterval(function () {
                            moldt = (Math.random()*5 + parseInt(mold[0])).toFixed(2)
                            meltt = (Math.random()*5 + parseInt(melt[0])).toFixed(2)
                            holdp = (Math.random()*3 + parseInt(hold[0])).toFixed(2)
                            injs = (Math.random()*3 + parseInt(inj[0])).toFixed(2)
                            var defect = "Y"
                            if(moldt<mold[0]-2*mold[1] || moldt>mold[0]+2*mold[1]
                            || meltt<melt[0]-2*melt[1] || meltt>melt[0]+2*melt[1]
                            || holdp<hold[0]-2*hold[1] || holdp>hold[0]+2*hold[1]
                            || injs<inj[0]-2*inj[1] || injs>inj[0]+2*inj[1]){
                                defect = "N"
                            }
                            connection.query(
                                `insert into monitoring` + date + `
                                 (mold_temp, melt_temp, injection_speed, hold_pressure, injection_time, hold_time, filling_time, cycle_time, defect, date)
                                 values(?, ?, ?, ?, 9.58, 7.13, 4.47, 59.52, ?, now())`,
                                [moldt, meltt, injs, holdp, defect],
                                function (err) {
                                    if (err) {
                                        console.log(err)
                                    }
                                }
                            )
                        }, 2000)
                    }
                    if (result[0]!=undefined && result[0].total==result[0].cnt){
                        res.redirect("/stop")
                    }else{
                        res.json({
                            "monitor" : result[0],
                            "melt" : req.session.melt,
                            "mold" : req.session.mold,
                            "hold" : req.session.hold,
                            "inj" : req.session.inj
                        })
                    }
                }
            }
        )
    }
})

app.get("/register", function(req, res){
    console.log(req.query.name)
    if (req.query.name == "용융온도"){
        var name = "melt_temp"
    }else if (req.query.name == "금형온도"){
        var name = "mold_temp"
    }else if (req.query.name == "보압"){
        var name = "hold_pressure"
    }else{
        var name = "injection_speed"
    }
    var set = req.query.set;
    var date = moment().format("YYYY-MM-DD")
    connection.query(
        `select * from setup where date(date) = ?`,
        [date],
        function(err, result){
            if (err){
                console.log(err)
            }else{
                if(result.length==0){
                    connection.query(
                        `insert into setup(`+name+`,date) values (?,?)`,
                        [set, date],
                        function(err){
                            if(err){
                                console.log(err)
                            }else{
                                res.redirect("/")
                            }
                        }
                    )
                }else{
                    connection.query(
                        `update setup set `+name+`=`+set+` where date(date)=?`,
                        [date],
                        function(err){
                            if(err){
                                console.log(err)
                            }else{
                                res.redirect("/")
                            }
                        }
                    )
                }
            }
        }
    )
})

app.get("/stop", function(req, res){
    req.session.run = false;
    clearInterval(interval);
    res.redirect("/")
})

const defect = require("./def");
app.use("/defect", defect);

const current = require("./cur");
app.use("/current", current);

const orderS = require("./ord");
app.use("/orderS", orderS);

const instruct = require("./ins");
app.use("/instruct", instruct)

const product = require("./pro");
app.use("/product", product)

app.get("/alert", function(req, res){
    res.render("alert")
})

app.listen(3000, function(){
    console.log("monitor server start")
})