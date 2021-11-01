const express = require("express");
const router = express.Router();
const fs = require("fs");
const data = JSON.parse(fs.readFileSync(__dirname + '/db.json'));
const mysql = require("mysql2");
const moment = require("moment");

const connection = mysql.createConnection({
    host : data.host,
    port : data.port,
    user : data.user,
    password : data.password,
    database : data.database    
})

router.get("/", function(req,res){
    var date = moment().format("YYYYMMDD")
    var today = moment().format("YYYY-MM-DD")
    if(!req.session.logged){
       res.redirect("/")
    }else{
        if (!req.session.dir){
            res.render("defect",{
                "defect" : [],
                "linkcode" : req.session.logged.linkcode,
                "run" : req.session.run,
                "Y" : null,
                "N" : null
            })
        }else{
            connection.query(
                `select *, 
                (select count(*) from monitoring`+date+` where defect='N') nn,
                (select count(*) from monitoring`+date+` where defect='Y') yy
                from defect where date(date) between date_sub(?, interval 1 month) and ?`,
                [date, date, date],
                function(err,result){
                    if(err){
                        console.log(err)
                    }else{
                        if(result.length==0){
                            yy = req.session.cnt
                            nn = 0
                        }else{
                            yy = result[0].yy
                            nn = result[0].nn
                        }
                        res.render("defect",{
                            'defect' : result,
                            "linkcode" : req.session.logged.linkcode,
                            "run" : req.session.run,
                            "Y" : yy,
                            "N" : nn,
                            "today" : today,
                            "lastM" : moment().subtract(1, 'M').format("YYYY-MM-DD")
                        });
                    }
                }
            )
        }
    }
})

router.get("/update", function(req, res){
    var _id = req.query._id
    if(_id!=req.session.monitor_id){
        req.session.monitor_id=_id
        var date = req.query.date
        var mold = req.query.mold
        var melt = req.query.melt
        var hold = req.query.hold
        var inj = req.query.inj
        var arr = ["치수 불량", "색 불량"]
        var cause = arr[Math.floor(Math.random()*arr.length)]
        connection.query(
            `insert into defect(monitor_id, date, mold, melt,
                hold, injection, cause)
            values (?,?,?,?,?,?,?)`,
            [_id,date,mold,melt,hold,inj,cause],
            function(err, result){
                if(err){
                   console.log(err)
                }
            }
        )
    }
})

router.get("/search", function(req,res){
    var date = req.query.date;
    var date2 = req.query.date2;
    console.log(date, date2)
    connection.query(
        `select date,cause,error from defect 
        where date(date) between ? and ?`,
        [date, date2],
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
})

router.get("/ajax", function(req, res){
    connection.query(
        `select * from defect order by defect_id desc limit 1`,
        function(err,result){
            if (err){
                console.log(err)
            }else{
                res.json({
                    "defect" : result
                })
            }
        }
    )
})

module.exports = router