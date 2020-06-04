let express = require('express');   //引入express
let Mock = require('mockjs');       //引入mock

let app = express();        //实例化express
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header("Access-Control-Allow-Headers", "Content-Length,X-Requested-With,Content-Type,lt,token");
//  res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use('/Hmx/getRecentHeartratesByHubsns',function(req, res){
 res.json(Mock.mock({
 'status': "1",
 'data':[{
            "errorcode":0,
            "errormsg":"",
            "result":{
                "antbpms":[
                    {
                        "ANT_A75D": {
                            "bpm": 125,
                            "stepnum": 3
                        },
                        "ANT_EC04": {
                            "bpm": 125,
                            "stepnum": 3
                        },
                    }
                ]
            }
        }
    ]
 })
)
})

app.listen('8090', () => {
 console.log('监听端口 8090')
})