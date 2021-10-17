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

router.get("/",function(req,res){
    var date = moment().format("YYYY-MM-DD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        if(req.session.logged.linkcode == 1){
            res.redirect("/alert")
        }else{
            connection.query(
                `select * from performance order by order_id`,
                function(err, result){
                    if(err){
                        console.log(err);
                        res.send("search SQL select Error")
                    }else{
                        res.render("product",{
                            "date" : date,
                            "performance" : result,
                            "linkcode" : req.session.logged.linkcode
                        })
                    }
                }
            )
        }
    }
})

router.get("/reset", function(req,res){
    connection.query(
        `select * from performance order by date desc`,
        function(err,result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                res.json({
                    "performance" : result
                })
            }

        }
    )
})

router.get("/search", function(req, res){
    var pp = req.query.pp;
    var pd = req.query.pd;
    console.log(pp)
    connection.query(
        `select * from performance where lego_name=? and date(date)=?`,
        [pp, pd],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    "performance": result
                });
            }
        }
    )
})

module.exports = router