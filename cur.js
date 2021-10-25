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

router.get("/", function(req, res){
    if(!req.session.logged){
        res.redirect("/")
    }else{
        res.render("current")   
    }
})

router.get("/cur",function(req, res){
    var date = moment().format("YYYYMMDD")
    if(req.session.dir){
        connection.query(
            `select * from monitoring`+date+` order by monitor_id desc limit 20`,
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    res.json({
                        "cur" : result,
                        "run" : req.session.run,
                        "set_melt" : req.session.set_melt,
                        "set_mold" : req.session.set_mold,
                        "set_inj" : req.session.set_inj,
                        "set_hold" : req.session.set_hold,
                        "mold" : req.session.mold,
                        "melt" : req.session.melt,
                        "inj" : req.session.inj,
                        "hold" : req.session.hold
                    })
                }
            }
        )
    }else{
        res.json({
            "cur" : [],
            "run" : req.session.run,
            "set_melt" : req.session.set_melt,
            "set_mold" : req.session.set_mold,
            "set_inj" : req.session.set_inj,
            "set_hold" : req.session.set_hold,
            "mold" : req.session.mold,
            "melt" : req.session.melt,
            "inj" : req.session.inj,
            "hold" : req.session.hold
        })
    }
    
})

router.get("/update", function(req, res){
    var date = moment().format("YYYYMMDD")
    connection.query(
        `select * from monitoring`+date+` order by monitor_id desc limit 1`,
        function(err, result){
            if(err){
                console.log(err)
            }else{
                res.json({
                    "cur" : result[0]
                })
            }
        }
    )
})

module.exports = router