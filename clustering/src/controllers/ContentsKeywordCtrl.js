'use strict';
const contentsKeywordModel = require('../models/ContentsKeywordModel');
const countBy = require('lodash.countby');
const TwitterKoreanProcessor = require('node-twitter-korean-text');

exports.contentsKeyword = async (req, res, next) => {
  const rank = 4; // 상위 키워드 갯수
  let arr = [];
  let sqlResult = {};
  let result = {};
  let contents;
  let title;

  try {
    sqlResult = await contentsKeywordModel.getNonBracketNews();

    for (let i = 0; i < sqlResult.lenght; i++) {
      title = sqlResult[i].title;
      contents = sqlResult[i].content + sqlResult[i].title;
      const normal = await TwitterKoreanProcessor.normalize(contents);
      const token = await TwitterKoreanProcessor.tokenize(normal);
      const array = await TwitterKoreanProcessor.tokensToJsonArray(token, true);       
      for (let i = 0; i < array.length; i++) {
        const temp = array[i];
        if (temp['koreanPos'] === 'Noun') {
          arr.push(temp['text']);
        }
      }
      arr = countBy(arr);
      result[i].title = title;
      result[i].keyword = keywordBySort(arr, rank); // count값이 높은 순으로 rank개 KEW WORD 추출
    }
  } catch (error) {
    return next(error);
  }
  return res.r(result);
}

function keywordBySort (arr, rank) {
  let keywordArr = [];
  keywordArr = Object.keys(arr).sort((a, b) => arr[b] - arr[a]);
  keywordArr = keywordArr.slice(0, rank);
  return keywordArr;
}