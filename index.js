const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const axios = require("axios");
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
global.document = new JSDOM({url:"http://localhost"})

document.cookie = "safeCookie1=foo; SameSite=Lax"; 
document.cookie = "safeCookie2=foo";  
document.cookie = "crossCookie=bar; SameSite=None; Secure";

app.use(express.static("public_html"));
app.listen(port, function () {
    console.log('listening on 80');
});

app.get("/pharmacy_list", (req, res) => {
    let api = async () => {
        let response = null;
        try {
            response = await axios.get("http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire", {
                params: {
                    "serviceKey": "7xOsftXGnAAavU6OeXkZ2H6LKK/Pam7qnxY4PgDM6UpBi1t+KNNWKeTnZcBzeFeQ7Pv7RO/P2Kz9v7cT8DVJXg==",
                    "Q0": req.query.Q0,
                    "Q1": req.query.Q1,
                    "QT": req.query.QT,
                    "QN": req.query.QN,
                    "ORD": req.query.ORD,
                    "pageNo": req.query.pageNo,
                    "numOfRows": req.query.numOfRows
                }
            })
        }
        catch (e) {
            console.log(e);
        }
        return response;
    }
    api().then((response) => {
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.json(response.data.response.body);
    });
});
