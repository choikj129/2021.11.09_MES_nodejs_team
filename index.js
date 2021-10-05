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

var run = false;
var dir = false;
app.get("/main", function(req, res){
    console.log("run : "+run)
    dir = false
    var date = moment().format("YYYYMMDD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select * from ordert where date(date)=(select date_format(now(),'%Y-%m-%d') from dual)`,
            function(err0, result0){
                if (err0){
                    console.log(err0)
                }else{
                    if(result0.length==0){
                        res.render("main",{
                            'monitor' : result0[0],
                            'run' : run,
                            'linkcode' : req.session.logged.linkcode,
                            "dir" : dir
                        })
                    }else{
                        dir = true;
                        connection.query(
                            `select * from monitoring`+date+` order by monitor_id desc limit 1`,
                            function(err, result){
                                if (err){
                                    console.log(err)
                                }else{
                                    res.render('main', {
                                        'monitor' : result[0],
                                        "run" : run,
                                        "linkcode" : req.session.logged.linkcode,
                                        "dir" : dir
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

var interval;
var id = 46;

app.get("/stop", function(req, res){
    run = false;
    clearInterval(interval);
    res.redirect("/")
})

app.get("/main_update", function(req, res){
    date = moment().format("YYYYMMDD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select * from monitoring`+date+` order by monitor_id desc limit 1`,
            function(err, result){
                if (err){
                    console.log(err)
                }else{
                    if (run == false){
                        run = true;
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
                    res.json({
                        "monitor" : result[0]
                    })
                }
            }
        )
    }
})

app.get("/defect", function(req,res){
    var date = moment().format("YYYYMMDD")
    if(!req.session.logged){
       res.redirect("/")
    }else{
        if (!dir){
            res.render("defect",{
                "defect" : [],
                "linkcode" : req.session.logged.linkcode
            })
        }else{
            connection.query(
                `select B.date, A.mold_temp, A.melt_temp, A.injection_speed, A.hold_pressure, A.injection_time, A.hold_time, A.filling_time, B.cause
                from monitoring`+date+` A, defect B where A.monitor_id=B.monitor_id and date(B.date) = (select date_format(`+date+`,'%Y%m%d') from dual)
                order by date desc`,
                function(err,result){
                    if(err){
                        console.log(err)
                    }else{
                        res.render("defect",{
                            'defect' : result,
                            "linkcode" : req.session.logged.linkcode
                        });
                    }
                }
            )
        }
    }
})

app.get("/defect_update", function(req, res){
    var _id = req.query._id
    var x = req.query.x
    var y = req.query.y
    var z = req.query.z
    var h = req.query.h
    var d = req.query.d
    var t = req.query.t
    var date = req.query.date
    console.log(_id+x+y+z+h+d+t)
    connection.query(
        `insert into defect(monitor_id, x_defect, y_defect, z_defect, stud_h_defect, stud_d_defect, thick_defect, date)
        values (?,?,?,?,?,?,?,?)`,
        [_id,x,y,z,h,d,t,date],
        function(err, result){
            if(err){
                console.log(err)
            }
        }
    )
})

app.get("/defect_search", function(req,res){
    var date = req.query.date;
    date = date.split("-")
    date = date[0]+date[1]+date[2]
    console.log(date)
    connection.query(
        `select * from defect where date(date)=`+date,
        function(err, result){
            if(err){
                console.log(err)
            }else{
                if(result.length==0){
                    console.log("no list")
                    res.json({
                        "defect" : result
                    })
                }else{
                    connection.query(
                        `select B.date, A.mold_temp, A.melt_temp, A.injection_speed, A.hold_pressure, A.injection_time, A.hold_time, A.filling_time, B.cause
                        from monitoring`+date+` A, defect B where A.monitor_id=B.monitor_id and date(B.date) = `+date+`
                        order by date desc`,
                        function(err1, result1){
                            if (err1){
                                console.log(err1)
                            }else{
                                res.json({
                                    "defect" : result1
                                })
                            }
                        }
                    )
                }
            }
        }
    )
})

app.get("/current", function(req, res){
    if(!req.session.logged){
        res.redirect("/")
    }else{
        res.render("current",{
            "linkcode" : req.session.logged.linkcode
        })
    }
})

app.get("/instruct",function(req,res){
    var date = moment().format("YYYY-MM-DD")
    var lastdate = moment().format("YYYY-MM-DD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        if(req.session.logged.linkcode == 1){
            res.redirect("/alert")
        }else{
            connection.query(
                `select * from ordert order by date desc`,
                function(err, result){
                    if(err){
                        console.log(err);
                        res.send("search SQL select Error")
                    }else{
                        res.render("instruct",{
                            "ordert" : result,
                            "date" : date,
                            "lastdate" : lastdate,
                            "linkcode" : req.session.logged.linkcode
                        })
                    }
                }
            )
        }
    }
})

app.post("/instruct", function(req, res){
    var name = req.body._manager;
    var quantity = req.body._quantity;
    var id = req.body._id;
    var date = req.body._date.split(" ~ ");
    var lastdate = date[1];
    date = date[0];
    var date_array = date.split("-");
    console.log(quantity, id, date);
    connection.query(
        `insert into ordert(manager, lego_id, quantity, date, lastdate) values (?, ?, ?, ?, ?)`,
        [name, id, quantity, date, lastdate],
        function(err, result){
            if(err){
                console.log(err);
                res.send("instruct SQL insert Error")
            }else{
                connection.query(
                    `create table monitoring` + date_array[0] + date_array[1] + date_array[2] + `
                    (monitor_id int auto_increment primary key,
                     mold_temp double not null,
                     melt_temp double not null,
                     injection_speed double not null,
                     hold_pressure double not null,
                     injection_time double not null,
                     hold_time double not null,
                     filling_time double not null,
                     cycle_time double not null,
                     x double not null,
                     y double not null,
                     z double not null,
                     stud_h double not null,
                     stud_d double not null,
                     thick double not null,
                     defect varchar(5) not null,
                     date text not null)`,
                    function(err2, result2){
                        res.redirect("/instruct")
                    }
                )
            }
        }
    )
})

app.get("/del", function(req,res){
    var id = req.query._id;
    id = id.replace(","," or order_id = ");
    console.log(id)
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `delete from ordert where order_id =`+id,
        function(err,result){
            if(err){
                console.log(err)
                res.send("instruct SQL delete error")
            }else{  
                res.redirect("/instruct")
            }
        })
    }
})

app.get("/alert", function(req, res){
    res.render("alert")
})

app.listen(3000, function(){
    console.log("monitor server start")
})