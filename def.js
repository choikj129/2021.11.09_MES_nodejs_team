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
    if(!req.session.logged){
       res.redirect("/")
    }else{
        if (!req.session.dir){
            res.render("defect",{
                "defect" : [],
                "linkcode" : req.session.logged.linkcode
            })
        }else{
            connection.query(
                `select date, cause, error,
                (select count(*) from monitoring`+date+` where defect='N') nn,
                (select count(*) from monitoring`+date+` where defect='Y') yy
                from defect where date(date) = ?`,
                [date],
                function(err,result){
                    if(err){
                        console.log(err)
                    }else{
                        res.render("defect",{
                            'defect' : result,
                            "linkcode" : req.session.logged.linkcode,
                            "run" : req.session.run,
                            "Y" : result[0].yy,
                            "N" : result[0].nn
                        });
                    }
                }
            )
        }
    }
})

router.get("/update", function(req, res){
    var _id = req.query._id
    var x = req.query.x
    var y = req.query.y
    var z = req.query.z
    var h = req.query.h
    var d = req.query.d
    var t = req.query.t
    var date = req.query.date
    var error = req.query.error
    console.log(error)
    connection.query(
        `insert into defect(monitor_id, x_defect, y_defect, z_defect, stud_h_defect, stud_d_defect, thick_defect, date, error)
        values (?,?,?,?,?,?,?,?,?)`,
        [_id,x,y,z,h,d,t,date,error],
        function(err, result){
            if(err){
                console.log(err)
            }
        }
    )
})

router.get("/search", function(req,res){
    var date = req.query.date;
    console.log(date)
    connection.query(
        `select date,cause,error from defect where date(date)=?`,
        [date],
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
    var date = moment().format("YYYYMMDD")
    if (!dir){
        res.json("defect",{
            "defect" : []
        })
    }else{
        connection.query(
            `select B.date, A.mold_temp, A.melt_temp, A.injection_speed, A.hold_pressure, A.injection_time, A.hold_time, A.filling_time, B.cause
            from monitoring`+date+` A, defect B where A.monitor_id=B.monitor_id and date(B.date) = (select date_format(`+date+`,'%Y%m%d') from dual)
            order by date desc`,
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
    }
})

module.exports = router