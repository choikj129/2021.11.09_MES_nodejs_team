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
    date = moment().format("YYYYMMDD")
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
                        avg(mold_s) mold_s, avg(melt_s) melt_s, avg(hold_s) hold_s, avg(injection_s) inj_s,
                        (select mold_temp from setup where date(date)=`+date+`) set_mold,
                        (select melt_temp from setup where date(date)=`+date+`) set_melt,
                        (select injection_speed from setup where date(date)=`+date+`) set_inj,
                        (select hold_pressure from setup where date(date)=`+date+`) set_hold,
                        (select sum(quantity) from ordert where date(date) =`+date+`) total
                         from optimum`,
                        function(err, result){
                            if(err){
                                console.log(err)
                            }else{
                                req.session.set_mold = parseFloat(result[0].set_mold)
                                req.session.set_melt = parseFloat(result[0].set_melt)
                                req.session.set_inj = parseFloat(result[0].set_inj)
                                req.session.set_hold = parseFloat(result[0].set_hold)
                                req.session.mold = [parseFloat(result[0].mold_m), parseFloat(result[0].mold_s)]
                                req.session.melt = [parseFloat(result[0].melt_m), parseFloat(result[0].melt_s)]
                                req.session.hold = [parseFloat(result[0].hold_m), parseFloat(result[0].hold_s)]
                                req.session.inj = [parseFloat(result[0].inj_m), parseFloat(result[0].inj_s)]
                                req.session.total = result[0].total
                                req.session.process = ""
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
                        `select *, sum(quantity) total, count(*) order_qty
                         from ordert where date(date)= ?`,
                         [date],
                        function(err0, result0){
                            if (err0){
                                console.log(err0)
                            }else{
                                connection.query(
                                    `select count(*) orders_qty from orders where date(orders_date)=?`,
                                    [date],
                                    function(err, result2){
                                        if(err){
                                            console.log(err)
                                        }else{
                                            if(result2.length==0){
                                                var orders_qty = 0
                                            }else{
                                                var orders_qty = result2[0].orders_qty
                                            }
                                            if(result0[0].total==null){
                                                res.render("main",{
                                                    'monitor' : null,
                                                    'run' : req.session.run,
                                                    'linkcode' : req.session.logged.linkcode,
                                                    "dir" : req.session.dir,
                                                    "melt" : req.session.melt,
                                                    "mold" : req.session.mold,
                                                    "hold" : req.session.hold,
                                                    "inj" : req.session.inj,
                                                    "setup" : result1[0],
                                                    "order_qty" : 0,
                                                    "orders_qty" : orders_qty,
                                                    "process" : req.session.process
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
                                                            if(result.length>0){
                                                                req.session.cnt = result[0].cnt
                                                            }
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
                                                                "setup" : result1[0],
                                                                "order_qty" : result0[0].order_qty,
                                                                "orders_qty" : orders_qty,
                                                                "process" : req.session.process
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
                    if(result.length>0){
                        req.session.cnt = result[0].cnt
                    }
                    var id = result.monitor_id
                    if (req.session.run == false){
                        req.session.run = true;
                        interval = setInterval(function () {
                            moldt = (Math.random()*10 + req.session.set_mold-5).toFixed(2)
                            meltt = (Math.random()*10 + req.session.set_melt-5).toFixed(2)
                            holdp = (Math.random()*6 + req.session.set_hold-3).toFixed(2)
                            injs = (Math.random()*6 + req.session.set_inj-3).toFixed(2)
                            var defect = "Y"
                            if(moldt<mold[0]-2*mold[1] || moldt>mold[0]+2*mold[1]
                            || meltt<melt[0]-2*melt[1] || meltt>melt[0]+2*melt[1]
                            || holdp<hold[0]-2*hold[1] || holdp>hold[0]+2*hold[1]
                            || injs<inj[0]-2*inj[1] || injs>inj[0]+2*inj[1]){
                                defect = "N"
                            }
                            
                            connection.query(
                                `insert into monitoring` + date + `
                                 (mold_temp, melt_temp, injection_time, hold_time, filling_time, cycle_time, date)
                                 values(?, ?, 9.58, 7.13, 4.47, 59.52, now())`,
                                [moldt, meltt],
                                function (err) {
                                    if (err) {
                                        console.log(err)
                                    }else{
                                        connection.query(
                                            `select monitor_id from monitoring` + date + ` limit 1`,
                                            function(err,result){
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    var id = result[0].monitor_id
                                                    req.session.process = "ready"
                                                    setTimeout(() => {
                                                        console.log("ready")
                                                        connection.query(
                                                            `update monitoring`+date+` set injection_speed=? 
                                                            where monitor_id=?`,
                                                            [injs, id],
                                                            function(err){
                                                                if(err){
                                                                    console.log(err)
                                                                }else{
                                                                    req.session.process = "injecting"
                                                                    setTimeout(() => {
                                                                        console.log("injecting")
                                                                        req.session.process = "filling"
                                                                        setTimeout(() => {
                                                                            console.log("filling")
                                                                            connection.query(
                                                                                `update monitoring`+date+` set hold_pressure=?, defect=?
                                                                                where monitor_id=?`,
                                                                                [holdp, defect, id],
                                                                                function(err){
                                                                                    if (err){
                                                                                        console.log(err)
                                                                                    }else{
                                                                                        req.session.process = "holding"
                                                                                        setTimeout(() => {
                                                                                            console.log("holding")
                                                                                            req.session.process = "seperating"
                                                                                        }, 300);
                                                                                    }
                                                                                }
                                                                            )
                                                                        }, 200);
                                                                    }, 400);
                                                                }
                                                            }
                                                        )
                                                    }, 500);
                                                }
                                            }
                                        )
                                        
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
                            "inj" : req.session.inj,
                            "process" : req.session.process
                        })
                    }
                }
            }
        )
    }
})

app.get("/register", function(req, res){
    var set = req.query.set;
    if (req.query.name == "용융온도"){
        var name = "melt_temp"
        req.session.set_melt = parseFloat(set)
    }else if (req.query.name == "금형온도"){
        var name = "mold_temp"
        req.session.set_mold = parseFloat(set)
    }else if (req.query.name == "보압"){
        var name = "hold_pressure"
        req.session.set_hold = parseFloat(set)
    }else{
        var name = "injection_speed"
        req.session.set_inj = parseFloat(set)
    }
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
    var url = req.query.url
    clearInterval(interval);
    res.redirect("/"+url)
    
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