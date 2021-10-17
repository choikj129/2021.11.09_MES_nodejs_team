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
    var lastdate = moment().format("YYYY-MM-DD")
    if(!req.session.logged){
        res.redirect("/")
    }else{
        if(req.session.logged.linkcode == 1){
            res.redirect("/alert")
        }else{
            connection.query(
                `select * from orders order by orders_id desc`,
                function(err, result){
                    if(err){
                        console.log(err);
                        res.send("search SQL select Error")
                    }else{
                        res.render("orderS",{
                            "orders" : result,
                            "date" : date,
                            "date_m" : lastdate,
                            "linkcode" : req.session.logged.linkcode
                        })
                    }
                }
            )
        }
    }
})

router.get("/del", function(req, res){
    var id = req.query._id;
    id = id.replace(/,/gi," or orders_id = ");
    console.log(id)
    if(!req.session.logged){
        res.redirect("/")
    }else{
        connection.query(
            `delete from orders where orders_id =`+id,
            function(err, result){
                if(err){
                    console.log(err)
                    res.send("orders SQL delete Error")
                }else{
                    res.redirect("/orderS")
                }
            }
        )
    }
})

router.post("/", function(req, res){
    var name = req.body._custname;
    var product = req.body._legoname;
    var quantity = req.body._quantity;
    var date_o = req.body._date_o;
    var date_d = req.body._date_d;
    var cid = req.body._cid;
    console.log(name, date_o, date_d);
    connection.query(
        `insert into orders(cust_name, lego_name, orders_qty, orders_date, delivery_date, cid) values (?, ?, ?, ?, ?, ?)`,
        [name, product, quantity, date_o, date_d, cid],
        function(err, result){
            
        }
    )
})

module.exports = router