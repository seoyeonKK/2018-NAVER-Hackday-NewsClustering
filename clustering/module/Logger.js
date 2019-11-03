const winston = require('winston');    				// 로그 처리 모듈
const winstonDaily = require('winston-daily-rotate-file');    	// 로그 일별 처리 모듈
const moment = require('moment');    		
const fs = require('fs');
const path = require('path');


// 시간 처리 모듈
function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'); // '2016-05-01 20:14:28.500 +0900'
};

const logger =  winston.createLogger ({
//winston 모듈로 만드는 로거(Logger, 로그를 출력하는 객체를 말할 때 사용하는 용어)는 transports 라는 속성 값으로 여러 개의 설정 정보를 전달 할 수 있다.
    transports: [
        new (winstonDaily)({
//이름이 info-file인 설정 정보는 매일 새로운 파일에 로그를 기록하도록 설정
            name: 'info-file',
            filename: './log/_',
            datePattern: 'YYYY-MM-dd',
            colorize: false,
            prepend : true,
// 50MB를 넘어 가면 자동으로 새로운 파일을 생성되며, 이때 자동으로 분리되어 생성 되는 파일의 개수는 최대 1000개 까지 가능하다.
            maxsize: 50000000,           
            maxFiles: 1000,
// info 수준의 로그만 기록하도록 설정함.
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});
module.exports = logger;