const express = require("express");
const app = express();
const fs = require("fs");
const data = JSON.parse(fs.readFileSync(__dirname + '/db.json'));
const mysql = require("mysql2");
const moment = require("moment");
const session = require("express-session");
const ps = require("python-shell");


const connection = mysql.createConnection({
    host : data.host,
    port : data.port,
    user : data.user,
    password : data.password,
    database : data.database    
})

var options = {
    mode: 'json',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: ['value1']
};

var interval;
module.exports={
    run : function(set_mold, set_melt, set_hold, set_inj, 
                    mold, melt, hold, inj){
        var date = moment().format("YYYYMMDD")
        interval = setInterval(function () {
            moldt = (Math.random()*10 + set_mold-5).toFixed(2)
            meltt = (Math.random()*10 + set_melt-5).toFixed(2)
            holdp = (Math.random()*6 + set_hold-3).toFixed(2)
            injs = (Math.random()*6 + set_inj-3).toFixed(2)
            var defect = "Y"
            if(moldt<mold[0]-2*mold[1] || moldt>mold[0]+2*mold[1]){
                var defect = "N"
                var mold_e = moldt+"x"
            }else{
                var mold_e = moldt+"o"
            }
            if(meltt<melt[0]-2*melt[1] || meltt>melt[0]+2*melt[1]){
                var defect = "N"
                var melt_e = meltt+"x"
            }else{
                var melt_e = meltt+"o"
            }
            if(holdp<hold[0]-2*hold[1] || holdp>hold[0]+2*hold[1]){
                var defect = "N"
                var hold_e = holdp+"x"
            }else{
                var hold_e = holdp+"o"
            }
            if(injs<inj[0]-2*inj[1] || injs>inj[0]+2*inj[1]){
                var defect = "N"
                var inj_e = injs+"x"
            }else{
                var inj_e = injs+"o"
            }
            connection.query(
                `insert into monitoring` + date + `
                (mold_temp, melt_temp, injection_speed, hold_pressure, injection_time, hold_time, filling_time, cycle_time, defect, date)
                values(?, ?, ?, ?, 9.58, 7.13, 4.47, 59.52, ?, now())`,
                [moldt, meltt, injs, holdp, defect],
                function (err) {
                    if (err) {
                        console.log(err)
                    }else{
                        if (defect=="N"){
                            connection.query(
                                `select * from monitoring`+date+` order by monitor_id desc limit 1`,
                                function(err, result){
                                    if (err){
                                        console.log(err)
                                    }else{
                                        var arr = ["치수 불량", "색 불량", "크랙"]
                                        var cause = arr[Math.floor(Math.random()*arr.length)]
                                        connection.query(
                                            `insert into defect(monitor_id, date, mold, melt,
                                            hold, injection, cause)
                                            values (?,?,?,?,?,?,?)`,
                                            [result[0].monitor_id,result[0].date,mold_e,melt_e,hold_e,inj_e,cause],
                                            function(err, result0){
                                            }
                                        )
                                    }
                                }
                            )
                        }
                        connection.query(
                            `select *,
                            (select count(*) from monitoring`+date+`) cnt, 
                            (select sum(quantity) from ordert where date(date) =`+date+`) total,
                            (select count(*) from monitoring`+date+` where defect="N") defect
                            from ordert where date(date)=?`,
                            [date],
                            function(err, result){
                                if(err){
                                    console.log(err)
                                }else{
                                    var n=0;
                                    for (var i=0; i<result.length; i++){
                                        n += result[i].quantity
                                        if (result[0].cnt<n){
                                            break
                                        }else if (result[0].cnt==n){
                                            var id = result[i]
                                            n += result[i].quantity
                                            connection.query(
                                                `insert into performance(order_id, date, lego_name, quantity, qty_good, qty_def, manager)
                                                values (?, now(), ?, ?, ?, ?, ?)`,
                                                [id.order_id, id.lego_name, id.quantity,
                                                id.quantity-result[0].defect, result[0].defect, id.manager.trim()],
                                                function(err){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                }
                                            )
                                            if(n==result[0].total){
                                                stop()
                                            }
                                            break
                                        }
                                    }
                                }
                            }
                        )

                    }
                }
            )
        }, 2000)
    },    
        
    stop : function(){
        clearInterval(interval);
    },

    test : function(){
        ps.PythonShell.run("xchart.py", options,
         function(err, result){
             if(err){
                console.log(err)
             }else{
                console.log(result)
             }
         })
    }
}
