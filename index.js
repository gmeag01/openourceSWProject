const express = require('express');
const app = express();
const port = process.env.PORT || 80;  // 포드 80번 사용
const axios = require("axios");  // 약국 정보를 가져오기 위해 사용
const jsdom = require('jsdom')  // SameSite = None 설정을 위해 사용

// Node.js에서는 브라우저에서 사용되는 DOM에 관한 객채가 존재하지 않음. 
// jsdom을 이용하여 DOM을 사용하자.
const { JSDOM } = jsdom;
global.document = new JSDOM({url:"http://localhost"}) 

// SameSite cookie 설정
document.cookie = "safeCookie1=foo; SameSite=Lax"; 
document.cookie = "safeCookie2=foo";  
document.cookie = "crossCookie=bar; SameSite=None; Secure";

// public_html 폴더 안 index.html 
app.use(express.static("public_html"));
// 포트 80번 정상 접속시 "listening on 80" 출력
app.listen(port, function () {
    console.log('listening on 80');
});

// 공공데이터포럼 openAPI을 사용해보자.
// 
app.get("/pharmacy_list", (req, res) => {
    // 비동기처리를 위해 async() 사용 (아직 비동기/동기 처리 다루는게 잘 이해는 안된다.)
    let api = async () => {
        let response = null;
        try {
            response = await axios.get("http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire", {  // 모든 처리가 끝날때까지 기다린다.
                params: {
                    "serviceKey": "(이곳에 공공데이터 서비스키 입력)",  // 서비스 키는 보고서에 첨부하도록 하겠습니다.
                    "Q0": req.query.Q0,  // 시도
                    "Q1": req.query.Q1,  // 시군구
                    "QT": req.query.QT,  // 요일 정보
                    "QN": req.query.QN,  // 기관명
                    "ORD": req.query.ORD,  // 순서
                    "pageNo": req.query.pageNo,  // 페이지 번호
                    "numOfRows": req.query.numOfRows  // 목록 건수
                }
            })
        }
        // 에러시 로그 출력
        // 정상일때 response 반환
        catch (e) {
            console.log(e);
        }
        return response;
    }
    // 매 처리 분기마다 모든 Origin에서 오는 요청 허용
    // json 형식으로 response
    api().then((response) => {
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.json(response.data.response.body);
    });
});
