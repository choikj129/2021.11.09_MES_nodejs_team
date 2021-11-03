const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('express-favicon');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const alert = require('./view/common/alertMsg');
const template = require('./view/common/template');
const wm = require('./weather-module');
const dbModule = require('./db-module');
const sm = require('./serial-module');
const ps = require('./python-shell');


const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
const userRouter = require('./userRouter');
const itemRouter = require('./itemRouter');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); // redirect jQuery
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/js'));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function () {}
    })
}));
app.use('/user', userRouter);

app.get('/home', function (req, res) {
    if (req.session.userId === undefined) {
        let html = alert.alertMsg('시스템을 사용하려면 먼저 로그인하세요.', '/');
        res.send(html);
    } else {
        // dbModule.getCurrentSensor(function(sensor) {
        //     dbModule.getCurrentActuator(function(actuator) {
        wm.getWeather(function (weather) {
            let navBar = template.navBar(true, weather, req.session.userName);
            let menuLink = template.menuLink(template.DUMMY);
            let view = require('./view/common/home');
            let html = view.home(navBar, menuLink);
            // let html = view.home(navBar, menuLink, sensor, actuator);
            res.send(html);
        });
        //     });
        // });
    }
});
app.use('/item', itemRouter);
app.get('/conveyor', function (req, res) {
    if (req.session.userId === undefined) {
        let html = alert.alertMsg('시스템을 사용하려면 먼저 로그인하세요.', '/');
        res.send(html);
    } else {
        try {
            sm.readSensor(function (result) {
                let arduinoData = result.end;
                dbModule.insertStep(arduinoData, function () {
                    dbModule.getCurrentStep(function (step) {
                        dbModule.getConItems(function (conItem) {
                            dbModule.getAllExams(function (examTable) {
                                dbModule.getCurruntExam(function (currentExam) {
                                    wm.getWeather(function (weather) {
                                        let navBar = template.navBar(false, weather, req.session.userName);
                                        let menuLink = template.menuLink(template.CONVEYOR_MENU);
                                        let view = require('./view/conveyor/conveyor');
                                        let html = view.conveyor(navBar, menuLink, conItem, examTable, step, currentExam);
                                        // console.log(step);
                                        // let s= step[0].aStep;
                                        // console.log(s);
                                        res.send(html);
                                    })
                                })
                            });
                        });
                    })
                })
            });
        } catch (ex1) {
            console.log(ex1);
        }
    }
});
app.post('/conveyor', function (req, res) {
    let eUid = req.session.userId;
    let selected = req.body.itemChoose; //모달 선택
    let eItemName = req.body.selected; //페이지 넘겨진후에도 선택된 값 유지

    let conStart = req.body.start; //1
    let end = parseInt(req.body.aStep);

    let actuator = new Object();
    actuator.start = end;
    let jsonData = JSON.stringify(actuator);


    if (end == 0) {
        if (selected !== undefined) { //시작버튼 누를때 시작
            let regParams = [eUid, selected]
            dbModule.registerExam(regParams, function () {

                sm.writeActuator(jsonData, function () {
                    setTimeout(function () {
                        try {
                            res.redirect('/conveyor'); // home 화면으로 보내기
                        } catch (ex) {
                            console.log(ex);
                        }
                    }, 5000);
                });
            })
        } else {
            let html = alert.alertMsg('상품을 선택해주시면 검사를 시작합니다.', '/conveyor');
            res.send(html);
        }

    } else if (end == 1) { // conveyor 1
        if (eItemName !== undefined) {
            sm.writeActuator(jsonData, function () {
                setTimeout(function () {
                    try {
                        res.redirect('/conveyor');
                    } catch (ex) {
                        console.log(ex);
                    }
                }, 7000);
            });
        }
    } else if (end == 2) {
        if (eItemName !== undefined) {
            ps.pythonRun(eItemName, function (exam) { //python start!
                let eSmr = exam[0];
                let eDeg = exam[1];
                let eImg = exam[2];
                dbModule.getExamCount(eItemName, function (count) {
                    dbModule.getBadExamCount(eItemName, function (bads) {
                        if (eDeg == 'bad') {
                            let eDefRate = (bads[0].count + 1) / (count[0].count + 1) * 100;
                            let params = [eSmr, eDeg, eDefRate, eImg];
                            dbModule.updateExam(params, function () { //update set examine
                                actuator.start = end; // bad서보모터 구동
                                actuator.exam = 3;
                                let badJsonData = JSON.stringify(actuator);
                                sm.writeActuator(badJsonData, function () {
                                    setTimeout(function () {
                                        try {
                                            res.redirect(`/conveyor`);
                                        } catch (ex3) {
                                            console.log(ex3);
                                        }
                                    }, 7000);
                                })
                            });
                        } else { //perfect, good examine db insert
                            let eDefRate = bads[0].count / (count[0].count + 1) * 100;
                            let params = [eSmr, eDeg, eDefRate, eImg];
                            dbModule.updateExam(params, function () {
                                actuator.start = end; // bad서보모터 구동
                                actuator.exam = 4;
                                let goodJsonData = JSON.stringify(actuator);
                                sm.writeActuator(goodJsonData, function () {
                                    setTimeout(function () {
                                        try {
                                            res.redirect(`/conveyor`);
                                        } catch (ex4) {
                                            console.log(ex4);
                                        }
                                    }, 7000);
                                })
                            });
                        }
                    })
                })
            })
        }
    } else if (end == 3) { // bad servomotor
        actuator.start = end; // bad서보모터 구동
        let badJsonData = JSON.stringify(actuator);
        sm.writeActuator(badJsonData, function () {
            setTimeout(function () {
                try {
                    res.redirect(`/conveyor`);
                } catch (ex3) {
                    console.log(ex3);
                }
            }, 5000);
        })
    } else if (end == 4) { // good servomotor + conveyor2
        actuator.start = end; // bad서보모터 구동
        let goodJsonData = JSON.stringify(actuator);
        sm.writeActuator(goodJsonData, function () {
            setTimeout(function () {
                try {
                    res.redirect(`/conveyor`);
                } catch (ex4) {
                    console.log(ex4);
                }
            }, 5000);
        })
    } else if (conStart == 0) { //중지버튼누를때
        res.redirect(`/conveyor`);
    }
});
app.get('/chart', function (req, res) {
    if (req.session.userId === undefined) {
        let html = alert.alertMsg('시스템을 사용하려면 먼저 로그인하세요.', '/');
        res.send(html);
    } else {
        dbModule.getExamChartDate(function (examData) {
            dbModule.getExamChartName(function (examName) {
                dbModule.getExamChartHour(function (examHour) {
                    dbModule.getExamChart(function(eDate){
                        dbModule.getExamChart1(function(eDeg1){
                            dbModule.getExamChart2(function(eDeg2){
                                dbModule.getExamChart3(function(eDeg3){
                                    wm.getWeather(function (weather) {
                                        let navBar = template.navBar(true, weather, req.session.userName);
                                        let menuLink = template.menuLink(template.CHART_MENU);
                                        let view = require('./view/chart/chart');
                                        let html = view.chart(navBar, menuLink, examData, examName, examHour, eDate, eDeg1, eDeg2, eDeg3);
                                        res.send(html);
                                    });
                                })
                            })
                        })
                    })
                });
            });
        });
    }
});
app.get('/gallery', function (req, res) {
    if (req.session.userId === undefined) {
        let html = alert.alertMsg('시스템을 사용하려면 먼저 로그인하세요.', '/');
        res.send(html);
    } else {
        let view = require('./view/common/gallery');
        dbModule.getCurruntGallery(function (photos) {
            wm.getWeather(function (weather) {
                let navBar = template.navBar(false, weather, req.session.userName);
                let menuLink = template.menuLink(template.GALLERY_MENU);
                wm.weatherObj(function (result) {
                    let html = view.gallery(navBar, menuLink, result, photos);
                    res.send(html);
                });
            });
        })
    }
});
app.get('/weather', function (req, res) {
    if (req.session.userId === undefined) {
        let html = alert.alertMsg('시스템을 사용하려면 먼저 로그인하세요.', '/');
        res.send(html);
    } else {
        let view = require('./view/common/weather');
        wm.getWeather(function (weather) {
            let navBar = template.navBar(false, weather, req.session.userName);
            let menuLink = template.menuLink(template.DUMMY);
            wm.weatherObj(function (result) {
                let html = view.weather(navBar, menuLink, result);
                res.send(html);
            });
        });
    }
});
app.get('*', function (req, res) {
    res.status(404).send('File not found');
});
app.listen(3000);