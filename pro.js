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
    var pp = req.query.product_i;
    var pd = req.query.product_d;
    var where = "";
    var li = [];
    var data = []
    sql = `select*from performance `
    if(pp!=""){
        li.push("lego_name = ?")
        data.push(pp)
    }
    if(pd!=""){
        li.push("date = ?")
        data.push(pd)
    }
    if(li.length>0){
        where += "where "
    }
    for (var i=0; i<li.length; i++){
        where += li[i]+" and "
    }
    sql2 = (sql+where)
    if(where!=""){
        sql2 = (sql2).slice(0,sql2.length-4)
    }
    connection.query(
        sql2,
        data,
        function(err,result){
            if(err){
                console.log(err)
            }else{
                res.json({
                    "performance" : result
                })
            }
        }
    )
    // connection.query(
    //     `select * from performance where lego_name=? and date(date)=?`,
    //     [pp, pd],
    //     (err, result) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.json({
    //                 "performance": result
    //             });
    //         }
    //     }
    // )
})

module.exports = router