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
                `select * from orders where date(orders_date) <= ? and date(delivery_date) >= ?`,
                [date, date],
                function(err0,result0){
                    if(err0){
                        console.log(err0)
                    }else{
                        connection.query(
                            `select * from ordert where date(date)=?`,
                            [date],
                            function(err, result){
                                if(err){
                                    console.log(err);
                                    res.send("search SQL select Error")
                                }else{
                                    res.render("instruct",{
                                        "ordert" : result,
                                        "orders" : result0,
                                        "date" : date,
                                        "lastdate" : lastdate,
                                        "linkcode" : req.session.logged.linkcode
                                    })
                                }
                            }
                        )
                    }
                }
            )
        }
    }
})

router.get("/register", function(req, res){
    var id = req.query.id
    var lego_name = req.query.name
    var qty = req.query.qty
    var date = req.query.date
    var manager = req.query.mg
    var date_array = date.split("-")
    connection.query(
        `insert into ordert(orders_id, lego_name, quantity, date, manager)
         values (?, ?, ?, ?, ?)`,
         [id, lego_name, qty, date, manager],
        function(err, result){
            if(err){
                console.log(err)
            }else{
                connection.query(
                    `create table monitoring` + date_array[0] + date_array[1] + date_array[2] + `
                    (monitor_id int auto_increment primary key,
                     mold_temp double not null,
                     melt_temp double not null,
                     injection_speed double not null,
                     hold_pressure double not null,
                     injection_time double not null,
                     hold_time double not null,
                     filling_time double not null,
                     cycle_time double not null,
                     defect varchar(5) not null,
                     date text not null)`,
                    function(err0){
                        res.redirect("/instruct")
                    }
                    
                )
                
            }
        }
    )
})

router.get("/search", function(req,res){
    var cust = req.query._cust;
    var lego = req.query._search_i;
    var date = req.query._date;
    sql = `select orders_id, cust_name, lego_name, orders_qty, orders_date, delivery_date, cid 
    from orders where date(orders_date) <= ? and date(delivery_date) >= ?`
    if(cust!=""){
        sql += " and cust_name='"+cust+"'"
    }
    if(lego!=""){
        sql += " and lego_name='"+lego+"'"
    }
    connection.query(
        sql,
        [date, date],
        function(err, result){
            if(err){
                console.log(err)
            }else{
                res.json({
                    "instruct" : result
                })
            }
        }
    )
})

router.get("/del", function(req,res){
    var id = req.query._id;
    id = id.replace(/,/gi," or order_id = ");
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

module.exports = router