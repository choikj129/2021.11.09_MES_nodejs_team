// 모니터링 페이지로 갔을 때 이상 조건 색 변경

// 진행 중일 때 페이지 로드시 자동 진행

//     var mold_temp = document.getElementById("now_mold_temp").innerText;
//     var melt_temp = document.getElementById("now_melt_temp").innerText;
//     var injection_speed = document.getElementById("now_injection_speed").innerText;
//     var hold_pressure = document.getElementById("now_hold_pressure").innerText;
//     var injection_time = document.getElementById("now_injection_time").innerText;
//     var hold_time = document.getElementById("now_hold_time").innerText;
//     var filling_time = document.getElementById("now_filling_time").innerText;

//     if (mold_temp !=0 && mold_temp<20 || mold_temp>30){
//         $("#now_mold_temp").css("background-color", "#F48453")
//     }else{
//         $("#now_mold_temp").css("background-color", "")
//     }
//     if (melt_temp !=0 && melt_temp<266 || melt_temp>286){
//         $("#now_melt_temp").css("background-color", "#F48453")
//     }else{
//         $("#now_melt_temp").css("background-color", "")
//     }
//     if (injection_speed !=0 && injection_speed<50 || injection_speed>60){
//         $("#now_injection_speed").css("background-color", "#F48453")
//     }else{
//         $("#now_injection_speed").css("background-color", "")
//     }
//     if (hold_pressure !=0 && hold_pressure<125 || hold_pressure>145){
//         $("#now_hold_pressure").css("background-color", "#F48453")
//     }else{
//         $("#now_hold_pressure").css("background-color", "")
//     }
//     if (injection_time !=0 && injection_time<8.5 || injection_time>10.5){
//         $("#now_injection_time").css("background-color", "#F48453")
//     }else{
//         $("#now_injection_time").css("background-color", "")
//     }
//     if (hold_time !=0 && hold_time<6.5 || hold_time>7.5){
//         $("#now_hold_time").css("background-color", "#F48453")
//     }else{
//         $("#now_hold_time").css("background-color", "")
//     }
//     if (filling_time !=0 && filling_time<4 || filling_time>5){
//         $("#now_filling_time").css("background-color", "#F48453")
//     }else{
//         $("#now_filling_time").css("background-color", "")
//     }


// 실시간 업데이트 함수
function now(){
    $.getJSON("/main_update",
    function(result){
        x="Y"; y="Y"; z="Y"; h="Y"; d="Y"; t="Y";
        $("#now_mold_temp").text(result.monitor.mold_temp)
        $("#now_melt_temp").text(result.monitor.melt_temp)
        $("#now_injection_speed").text(result.monitor.injection_speed)
        $("#now_hold_pressure").text(result.monitor.hold_pressure)
        $("#now_injection_time").text(result.monitor.injection_time)
        $("#now_hold_time").text(result.monitor.hold_time)
        $("#now_filling_time").text(result.monitor.filling_time)
        $("#now_cycle_time").text(result.monitor.cycle_time)

        // if (result.monitor.mold_temp<20 || result.monitor.mold_temp>30){
        //     $("#now_mold_temp").css("background-color", "#F48453")
        // }else{
        //     $("#now_mold_temp").css("background-color", "")
        // }
        // if (result.monitor.melt_temp<266 || result.monitor.melt_temp>286){
        //     $("#now_melt_temp").css("background-color", "#F48453")
        // }else{
        //     $("#now_melt_temp").css("background-color", "")
        // }
        // if (result.monitor.injection_speed<50 || result.monitor.injection_speed>60){
        //     $("#now_injection_speed").css("background-color", "#F48453")
        // }else{
        //     $("#now_injection_speed").css("background-color", "")
        // }
        // if (result.monitor.hold_pressure<125 || result.monitor.hold_pressure>145){
        //     $("#now_hold_pressure").css("background-color", "#F48453")
        // }else{
        //     $("#now_hold_pressure").css("background-color", "")
        // }
        // if (result.monitor.injection_time<8.5 || result.monitor.injection_time>10.5){
        //     $("#now_injection_time").css("background-color", "#F48453")
        // }else{
        //     $("#now_injection_time").css("background-color", "")
        // }
        // if (result.monitor.hold_time<6.5 || result.monitor.hold_time>7.5){
        //     $("#now_hold_time").css("background-color", "#F48453")
        // }else{
        //     $("#now_hold_time").css("background-color", "")
        // }
        // if (result.monitor.filling_time<4 || result.monitor.filling_time>5){
        //     $("#now_filling_time").css("background-color", "#F48453")
        // }else{
        //     $("#now_filling_time").css("background-color", "")
        // }

        if (result.monitor.defect == "N"){
            if(result.monitor.x !=48){
                x = "N"
            }
            if(result.monitor.y !=31.9){
                y = "N"
            }
            if(result.monitor.z !=15.8){
                z = "N"
            }
            if(result.monitor.stud_h !=4.5){
                h = "N"
            }
            if(result.monitor.stud_d !=4.8){
                d = "N"
            }
            if(result.monitor.thick !=1.5){
                t = "N"
            }
            location.href="/defect_update?x="+x+"&y="+y+"&z="+z+"&h="+h+"&d="+d+"&t="+t+"&_id="+result.monitor.monitor_id+"&date="+result.monitor.date
        }
    })
}
var interval;
function start(){
    interval = setInterval(function(){
        now()
    },2000)
}

function stop(){
    clearInterval(interval);
    location.href = "/stop"
}