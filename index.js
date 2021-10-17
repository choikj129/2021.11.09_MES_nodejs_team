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
                    res.redirect("/main")
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
                            "dir" : req.session.dir
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
                                        "order" : result0
                                    })
                                }
                            }
                        )        
                    }
                }
            }
        )
    }
})

app.get("/main_update", function(req, res){
    date = moment().format("YYYYMMDD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select *, (select count(*) from monitoring`+date+`) cnt, 
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
                            id += 1
                            console.log(id)
                            connection.query(
                                `insert into monitoring` + date + `
                                 (mold_temp, melt_temp, injection_speed, hold_pressure, injection_time, hold_time, filling_time, cycle_time, x, y, z, stud_h, stud_d, thick, defect, date)
                                select mold_temp, melt_temp, injection_speed, hold_pressure, injection_time, hold_time, filling_time, cycle_time, x, y, z, stud_h, stud_d, thick, defect, now() 
                                    from data where monitor_id = ` + id,
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
                            "monitor" : result[0]
                        })
                    }
                }
            }
        )
    }
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