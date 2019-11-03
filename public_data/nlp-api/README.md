# nlp-api 

## Dependencies
- Node.js 8.x ~

## Install
- https://koalanlp.github.io/nodejs-koalanlp/ 참고
- 최초 사용시 다운로드 진행 중 취소하면 안됨. 취소했을 경우 Maven repository 저장 공간인 (~/.m2) 폴더에서 오류가 나는 패키지를 삭제하시고 다시 시작
```
$ npm install
```

## Start
```
$ npm start
```

## Test
```
$ curl -X POST -H "Content-Type: application/json; charset=utf-8" -d '{"text":"안녕. 오랜만이야."}' http://localhost:3000/api/nlp/parse 
```