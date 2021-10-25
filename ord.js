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

router.get("/search", function(req, res){
    var cust = req.query.search_c;
    var product = req.query.search_i;
    var date_o = req.query._date_o;
    var date_d = req.query._date_d;
    var where = "";
    var li = [];
    var data = []
    sql = `select * from orders `
    if(cust!=""){
        li.push("cust_name = ?")
        data.push(cust)
    }
    if(product!=""){
        li.push("lego_name = ?")
        data.push(product)
    }
    if(date_o!=""){
        li.push("orders_date = ?")
        data.push(date_o)
    }
    if(date_d!=""){
        li.push("delivery_date = ?")
        data.push(date_d)
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
    console.log(data)
    connection.query(
        sql2,
        data,
        function(err,result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                res.json({
                    "orders" : result
                })
            }
        }
    )
})

router.get("/submit", function(req, res){
    var name = req.query._custname;
    var product = req.query._legoname;
    var quantity = req.query._quantity;
    var date_o = req.query._date_o;
    var date_d = req.query._date_d;
    var cid = req.query._cid;
    console.log(name, date_o, date_d);
    connection.query(
        `insert into orders(cust_name, lego_name, orders_qty, orders_date, delivery_date, cid) values (?, ?, ?, ?, ?, ?)`,
        [name, product, quantity, date_o, date_d, cid],
        function(err, result){
            if(err){
                console.log(err)
                res.send("orderS insert SQL ERROR")
            }else{
                res.redirect("/orderS")
            }
        }
    )
})

router.get("/modify", function(req, res){
    var id = req.query._id;
    var quantity = req.query._quantity;
    var date_d = req.query._date_d;
    var mid = req.query._mid;
    console.log(id);
    connection.query(
        `update orders set orders_qty=?, delivery_date=?, mid=? 
         where orders_id = ?`,
        [quantity, date_d, mid, id],
        function(err, result){
            if(err){
                console.log(err)
                res.send("orderS update SQL ERROR")
            }else{
                res.redirect("/orderS")
            }
        }
    )
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