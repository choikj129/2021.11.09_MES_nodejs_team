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
        connection.query(
            `select *, 
            (select sum(qty_def) from performance where date(date) between date_sub(?, interval 1 month) and ?) nn,
            (select sum(qty_good) from performance where date(date) between date_sub(?, interval 1 month) and ?) yy,
            (select count(*) from defect where cause='크랙' and date(date) between date_sub(?, interval 1 month) and ?) crack,
            (select count(*) from defect where cause='치수 불량' and date(date) between date_sub(?, interval 1 month) and ?) size,
            (select count(*) from defect where cause='색 불량' and date(date) between date_sub(?, interval 1 month) and ?) color
            from defect where date(date) between date_sub(?, interval 1 month) and ?
            order by defect_id desc`,
            [date, date,date, date,date, date,date, date,date, date,date, date],
            function(err,result){
                if(err){
                    console.log(err)
                }else{
                    res.render("defect",{
                        "defect" : result,
                        "linkcode" : req.session.logged.linkcode,
                        "run" : req.session.run,
                        "Y" : result[0].yy,
                        "N" : result[0].nn,
                        "crack" : result[0].crack,
                        "color" : result[0].color,
                        "size" : result[0].size,
                        "today" : today,
                        "lastM" : moment().subtract(1, 'M').format("YYYY-MM-DD")
                    })
                }
            }
        )
    }
})

router.get("/search", function(req,res){
    var date = req.query.date;
    var date2 = req.query.date2;
    connection.query(
        `select 
        (select sum(qty_def) from performance where date(date) between ? and ?) nn,
        (select sum(qty_good) from performance where date(date) between ? and ?) yy,
        (select count(*) from defect where cause='크랙' and date(date) between ? and ?) crack,
        (select count(*) from defect where cause='치수 불량' and date(date) between ? and ?) size,
        (select count(*) from defect where cause='색 불량' and date(date) between ? and ?) color`,
        [date, date2,date, date2,date, date2,date, date2,date, date2],
        function(err, result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                connection.query(
                    `select * from defect 
                    where date(date) between ? and ?
                    order by defect_id desc`,
                    [date, date2],
                    function(err1, result1){
                        if (err1){
                            console.log(err1)
                        }else{
                            res.json({
                                "defect" : result1,
                                "count" : result[0]
                            })
                        }
                    }
                )           
            }
        }

    )
})
router.get("/reset", function(req,res){
    var date = moment().format("YYYY-MM-DD")
    connection.query(
        `select 
        (select sum(qty_def) from performance where date(date) between date_sub(?, interval 1 month) and ?) nn,
        (select sum(qty_good) from performance where date(date) between date_sub(?, interval 1 month) and ?) yy,
        (select count(*) from defect where cause='크랙' and date(date) between date_sub(?, interval 1 month) and ?) crack,
        (select count(*) from defect where cause='치수 불량' and date(date) between date_sub(?, interval 1 month) and ?) size,
        (select count(*) from defect where cause='색 불량' and date(date) between date_sub(?, interval 1 month) and ?) color`,
        [date, date,date, date,date, date,date, date,date, date],
        function(err, result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                connection.query(
                    `select * from defect 
                    where date(date) between date_sub(?, interval 1 month) and ?
                    order by defect_id desc`,
                    [date, date],
                    function(err1, result1){
                        if (err1){
                            console.log(err1)
                        }else{
                            res.json({
                                "defect" : result1,
                                "count" : result[0]
                            })
                        }
                    }
                )           
            }
        }

    )
})

router.get("/ajax", function(req, res){
    var date = moment().format("YYYYMMDD")
    connection.query(
        `select (select count(*) from monitoring`+date+`) cnt, 
        (select sum(quantity) from ordert where date(date)=?) total,
        (select count(*) from monitoring`+date+` where defect="Y") yy,
        (select count(*) from monitoring`+date+` where defect="N") nn,
        (select count(*) from defect where cause='크랙' and date(date)=?) crack,
        (select count(*) from defect where cause='치수 불량' and date(date)=?) size,
        (select count(*) from defect where cause='색 불량' and date(date)=?) color
        `,
        [date,date,date,date],
        function(err, result0){
            if(err){
                console.log(err)
            }else{
                connection.query(
                    `select * from defect order by defect_id desc limit 1`,
                    function(err,result){
                        if (err){
                            console.log(err)
                        }else{
                            res.json({
                                "defect" : result[0],
                                "run" : req.session.run,
                                "count" : result0[0]
                            })
                        }
                    }
                )
            }
        }
    )
})

module.exports = router