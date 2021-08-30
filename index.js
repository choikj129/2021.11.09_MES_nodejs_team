const express = require("express");
const app = express();
const mysql = require("mysql2");
const moment = require("moment");

const connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1111',
    database : 'test'    
})

app.set("views", __dirname+"/views");
app.set("view engine", "ejs")

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("main");
})

app.listen(3000, function(){
    console.log("monitor server start")
})
