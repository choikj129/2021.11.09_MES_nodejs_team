const express = require("express");
const app = express();
const mysql = require("mysql2");
const moment = require("moment");

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1111',
    database : 'project'    
})

app.set("views", __dirname+"/views");
app.set("view engine", "ejs")

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.get("/", function(req, res){
    connection.query(
        `select * from monitoring`,
        function(err, result){
            if (err){
                console.log(err)
            }else{
                
                res.render('main', {
                    'monitor' : result
                })
            }
        }
    )
})

app.get("/now_update", function(req, res){
    var id = req.query._id
    connection.query(
        `select * from monitoring where monitor_id=`+id,
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
})

app.listen(3000, function(){
    console.log("monitor server start")
})
