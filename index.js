const express = require("express");
const app = express();
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1111',
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

var id = 0;
var run = false;

app.get("/main", function(req, res){
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
                        console.log("No instruct")
                        res.render("main",{
                            'monitor' : result0[0],
                            'run' : run,
                            'linkcode' : req.session.logged.linkcode
                        })
                    }else{
                        console.log("today")
                        connection.query(
                            `select * from monitoring`+date+` order by monitor_id desc limit 1`,
                            function(err, result){
                                if (err){
                                    console.log(err)
                                }else{
                                    console.log(result[0])
                                    res.render('main', {
                                        'monitor' : result[0],
                                        "run" : run,
                                        "linkcode" : req.session.logged.linkcode
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

app.get("/now_update", function(req, res){
    id += 1
    run = true;
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `insert into monitoring select *, now() from data where monitor_id = `+id,
            function(err0, result0){
                if (err0){
                    console.log(err0)
                }else{
                    connection.query(
                        `select * from monitoring order by monitor_id desc limit 1`,
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
                }
            }
            
        )
    }
})

app.get("/stop", function(req, res){
    run = false;
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
                    console.log(result)
                    res.render("defect",{
                        'defect' : result,
                        'id' : id,
                        "linkcode" : req.session.logged.linkcode
                    });
                }
            }
        )
    }
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
    var date = req.body._date;
    var date_array = date.split("-");
    console.log(quantity, id, date);
    connection.query(
        `insert into ordert(manager, lego_id, quantity, date) values (?, ?, ?, ?)`,
        [name, id, quantity, date],
        function(err, result){
            if(err){
                console.log(err);
                res.send("instruct SQL insert Error")
            }else{
                connection.query(
                    `create table monitoring`+date_array[0]+date_array[1]+date_array[2]+`
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
                         if(err2){
                             console.log(err2)
                         }else{
                            res.redirect("/instruct")
                         }
                     }
                )
                
            }
        }
    )
})

app.get("/del", function(req,res){
    var id=req.query._id;
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

