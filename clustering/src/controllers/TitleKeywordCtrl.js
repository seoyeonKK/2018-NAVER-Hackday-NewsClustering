'use strict';
const tkModel = require('../models/TitleKeywordModel');
const TwitterKoreanProcessor = require('node-twitter-korean-text');
const countBy = require('lodash.countby');
const distance = require('jaro-winkler');
const test = require('../models/test.json');
const wrap = require ('express-async-wrap');
const _ = require ('lodash');


exports.titleKeyword = wrap (async (req, res, next) => {
  let jaroList = '';
  let series = '';
  let result;
  let getBracketNewsResult = '';

  getBracketNewsResult = await tkModel.getBracketNews();

  const jaroResult = jaroWinkler(getBracketNewsResult);
  const finalResult = _.groupBy(jaroResult, 'title_keyword');

  for (const title of Object.keys(finalResult)) {
    const seriesData = {
      title: title,
      keyword: title,
      cnt: finalResult[title].length,
      create_dt: new Date(),
      update_dt: new Date()
    };
    let setSeriesResult = await tkModel.setSeries(seriesData);
    for (const seriesItem of finalResult[title]) {
      // TODO: insert item
      const seriesItemData = {
        series_id: setSeriesResult.insertId,
        office_id: seriesItem.office_id,
        article_id: seriesItem.article_id,
        is_completed : false
      };
      await tkModel.setSeriesItem(seriesItemData);
    }  
  console.log("SUCCESS");
  };
});

function jaroWinkler(result) {
  let resultArr = [];

  for (let i = 0; i < result.length; i++) {
    const source = result[i];
    const sourceContentId = `${source.office_id}${source.article_id}`;
    for (let j = i + 1; j < result.length; j++) {
      const target = result[j];
      const targetContentId = `${result[j].office_id}${result[j].article_id}`;
      const sim = distance(source.title_keyword, target.title_keyword);

      if (sim > 0.8) {
          const existItem = _.find(resultArr, r => {
              return r.office_id === target.office_id &&
                  r.article_id === target.article_id &&
                  (r.sim > sim)
          });
          if (!existItem) {
              _.remove(resultArr, r => r.office_id === target.office_id &&
                  r.article_id === target.article_id);
              const resultItem = {
                office_id: target.office_id,
                article_id: target.article_id,
                title_keyword: target.title_keyword,
                sim
              };
              resultArr.push(resultItem);
          }
      }
    }
  }
  return resultArr;
}

function jarowinkler(result) {
  let value;
  let list = [];
  list.series_title = '';
  list.series = '';
  for (let i = 0; i < result.length; i++) {
    let arr = [];
    arr.push(result[i]);
    for (let j = i + 1; j < result.length; j++) {
      value = distance(result[i].title_keyword, result[j].title_keyword);
      if (value > 0.5) {

        result[j].sim = value;
        arr.push(result[j]);
      }
    }
    list[i] = arr;
  }
  return list;
}

function getSeriesTitle(list) {
  let res;
  let result;
  let keyword = '';
  for (let i = 0; i < list.length; i++) {
    res = list[i][0].title_keyword.split(" ");
    list[i].series_title = '';
    for (let k = 0; k < res.length; k++) {
      for (let j = 0; j < list[i].length; j++) {
        if (list[i][j].title_keyword.match(res[k]) != -1) 
          keyword = res[k];  
      }    
      list[i].series_title = list[i].series_title + keyword;
    }  
  }
  return list;
}


function keywordBySort (arr) {
  let keywordArr = [];
  let sortArr = [];
  keywordArr = Object.keys(arr).sort((a, b) => arr[b] - arr[a]);
  sortArr = keywordArr.slice(0, 2);
  return sortArr[0];
}