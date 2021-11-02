// 모니터링 페이지로 갔을 때 이상 조건 색 변경

// 진행 중일 때 페이지 로드시 자동 진행

    // var mold_temp = document.getElementById("now_mold_temp").innerText;
    // var melt_temp = document.getElementById("now_melt_temp").innerText;
    // var injection_speed = document.getElementById("now_injection_speed").innerText;
    // var hold_pressure = document.getElementById("now_hold_pressure").innerText;
    // var injection_time = document.getElementById("now_injection_time").innerText;
    // var hold_time = document.getElementById("now_hold_time").innerText;
    // var filling_time = document.getElementById("now_filling_time").innerText;

    // if (mold_temp !=0 && mold_temp<20 || mold_temp>30){
    //     $("#now_mold_temp").css("background-color", "#F48453")
    // }else{
    //     $("#now_mold_temp").css("background-color", "")
    // }
    // if (melt_temp !=0 && melt_temp<266 || melt_temp>286){
    //     $("#now_melt_temp").css("background-color", "#F48453")
    // }else{
    //     $("#now_melt_temp").css("background-color", "")
    // }
    // if (injection_speed !=0 && injection_speed<50 || injection_speed>60){
    //     $("#now_injection_speed").css("background-color", "#F48453")
    // }else{
    //     $("#now_injection_speed").css("background-color", "")
    // }
    // if (hold_pressure !=0 && hold_pressure<125 || hold_pressure>145){
    //     $("#now_hold_pressure").css("background-color", "#F48453")
    // }else{
    //     $("#now_hold_pressure").css("background-color", "")
    // }
    // if (injection_time !=0 && injection_time<8.5 || injection_time>10.5){
    //     $("#now_injection_time").css("background-color", "#F48453")
    // }else{
    //     $("#now_injection_time").css("background-color", "")
    // }
    // if (hold_time !=0 && hold_time<6.5 || hold_time>7.5){
    //     $("#now_hold_time").css("background-color", "#F48453")
    // }else{
    //     $("#now_hold_time").css("background-color", "")
    // }
    // if (filling_time !=0 && filling_time<4 || filling_time>5){
    //     $("#now_filling_time").css("background-color", "#F48453")
    // }else{
    //     $("#now_filling_time").css("background-color", "")
    // }


// 실시간 업데이트 함수
function now(){
    $.getJSON("/main_update",
    function(result){
        if(result.monitor.cnt==result.monitor.total){
            clearInterval(interval);
            clearInterval(interval2);
            location.href = "/stop?url=main"
        }
        $("#now_mold_temp").text(result.monitor.mold_temp)
        $("#now_melt_temp").text(result.monitor.melt_temp)
        $("#now_injection_speed").text(result.monitor.injection_speed)
        $("#now_hold_pressure").text(result.monitor.hold_pressure)
        $("#cnt").text(result.monitor.cnt)
        $("#qnt").text(Math.round(result.monitor.cnt/result.monitor.total*100)+"%")
        $("#def").text(Math.round(result.monitor.def/result.monitor.cnt*100)+"%")

        if (result.monitor.mold_temp<result.mold[0]-2*result.mold[1]
        || result.monitor.mold_temp>result.mold[0]+2*result.mold[1]){
            $("#mold_box").css("border", "4px solid red")
        }else{
            $("#mold_box").css("border", "4px solid rgb(30, 255, 180)")
        }
        if (result.monitor.melt_temp<result.melt[0]-2*result.melt[1] 
        || result.monitor.melt_temp>result.melt[0]+2*result.melt[1]){
            $("#melt_box").css("border", "4px solid red")
        }else{
            $("#melt_box").css("border", "4px solid rgb(30, 255, 180)")
        }
        if (result.monitor.injection_speed<result.inj[0]-2*result.inj[1]
        || result.monitor.injection_speed>result.inj[0]+2*result.inj[1]){
            $("#inj_box").css("border", "4px solid red")
        }else{
            $("#inj_box").css("border", "4px solid rgb(30, 255, 180)")
        }
        if (result.monitor.hold_pressure<result.hold[0]-2*result.hold[1]
        || result.monitor.hold_pressure>result.hold[0]+2*result.hold[1]){
            $("#hold_box").css("border", "4px solid red")
        }else{
            $("#hold_box").css("border", "4px solid rgb(30, 255, 180)")
        }
    })
}
var interval;
var interval2;
function start(){
    interval = setInterval(function(){
        now()
    },1005)

    interval2 = setInterval(() => {
        $("#b5").children("div:eq(0)").css("border","")
        $("#b5").children("div:eq(1)").css("border","")
        $("#b1").children("div:eq(0)").css({"border":"2px solid white", "border-bottom":"none"})
        $("#b1").children("div:eq(1)").css({"border":"2px solid white", "border-top":"none"})

        setTimeout(() => {
            $("#b1").children("div:eq(0)").css("border","")
            $("#b1").children("div:eq(1)").css("border","")
            $("#b2").children("div:eq(0)").css({"border":"2px solid white", "border-bottom":"none"})
            $("#b2").children("div:eq(1)").css({"border":"2px solid white", "border-top":"none"})
            setTimeout(() => {
                $("#b2").children("div:eq(0)").css("border","")
                $("#b2").children("div:eq(1)").css("border","")
                $("#b3").children("div:eq(0)").css({"border":"2px solid white", "border-bottom":"none"})
                $("#b3").children("div:eq(1)").css({"border":"2px solid white", "border-top":"none"})
                setTimeout(() => {
                    $("#b3").children("div:eq(0)").css("border","")
                    $("#b3").children("div:eq(1)").css("border","")
                    $("#b4").children("div:eq(0)").css({"border":"2px solid white", "border-bottom":"none"})
                    $("#b4").children("div:eq(1)").css({"border":"2px solid white", "border-top":"none"})
                    setTimeout(() => {
                        $("#b4").children("div:eq(0)").css("border","")
                        $("#b4").children("div:eq(1)").css("border","")
                        $("#b5").children("div:eq(0)").css({"border":"2px solid white", "border-bottom":"none"})
                        $("#b5").children("div:eq(1)").css({"border":"2px solid white", "border-top":"none"})
                        setTimeout(() => {
                        }, 600);
                    }, 300);
                }, 200);
            }, 400);
        }, 500);
    }, 2000);
}

function stop(){
    clearInterval(interval);
    clearInterval(interval2);
    location.href = "/stop?url=main"
}