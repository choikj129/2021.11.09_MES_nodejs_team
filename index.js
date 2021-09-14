const express = require("express");
const app = express();
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");

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
    console.log(id)
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select * from monitoring order by monitor_id desc limit 1`,
            function(err, result){
                if (err){
                    console.log(err)
                }else{
                    console.log(result[0])
                    res.render('main', {
                        'monitor' : result[0],
                        "run" : run
                    })
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
                        'id' : id
                    });
                }
            }
        )
    }
})

app.post("/instruct", function(req, res){
    var name = req.body._manager;
    var quantity = req.body._quantity;
    var id = req.body._id;
    var date = req.body._date;
    console.log(quantity, id, date);
    connection.query(
        `insert into ordert(manager, lego_id, quantity, date) values (?, ?, ?, ?)`,
        [name, id, quantity, date],
        function(err, result){
            if(err){
                console.log(err);
                res.send("instruct SQL insert Error")
            }else{
                res.redirect("/instruct")
            }
        }
    )


})

app.get("/stop", function(req, res){
    run = false;
})

app.get("/current", function(req, res){
    if(!req.session.logged){
        res.redirect("/")
    }else{
        res.render("current")
    }
})

app.get("/instruct",function(req,res){
    var date = moment().format("YYYY-MM-DD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `select * from ordert`,
            function(err, result){
                if(err){
                    console.log(err);
                    res.send("search SQL select Error")
                }else{
                    res.render("instruct",{
                        "ordert" : result,
                        "date" : date
                    })
                }
            }
        )
    }
})


app.listen(3000, function(){
    console.log("monitor server start")
})
