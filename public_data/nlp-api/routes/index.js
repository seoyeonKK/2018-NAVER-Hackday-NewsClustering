const express = require('express');
const router = express.Router();
const koalanlp = require('koalanlp'); // Import

const API = koalanlp.API; // Tagger/Parser Package 지정을 위한 목록
const POS = koalanlp.POS; // 품사 관련 utility
let tagger, parser;

koalanlp.initialize({
  packages: [API.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
    API.KKMA], // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
  version: "1.9.2", // 사용하는 KoalaNLP 버전 (1.9.2 사용)
  javaOptions: ["-Xmx4g"],
  debug: true // Debug output 출력여부
}).then(function(){
  // 품사분석기
  tagger = new koalanlp.Tagger(API.EUNJEON);

  // 의존구문분석기
  parser = new koalanlp.Parser(API.KKMA, API.EUNJEON);
}).catch(err => {
  console.error(err);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/nlp/parse', (req, res) => {
  const text = req.body.text;

  if (!parser) {
    return res.send("Parser is not initialized!");
  }
  if (!text) {
    return res.send("Text not exist!");
  }

  // Dependency Parsing
  parser.parse(text)
    .catch(function(error){
      console.error(error);
    }).then(function(parsed){
      parsed.map(s => {
        console.log(s.nouns());
        console.log(s.verbs());
      });

      res.send(parsed)
    });
});

module.exports = router;
