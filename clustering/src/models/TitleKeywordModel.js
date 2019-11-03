'use strict';
const pool = require('../../config/DBPool');

exports.getBracketNews = () => {
  return new Promise((resolve, reject) => {
    const sql =
    `
    SELECT office_id, article_id, dt, title_keyword
    FROM brackets_news
    WHERE brackets_news.title_keyword NOT IN ('종합', '리뷰', '카드뉴스', '카메라 뉴스', '카메라뉴스', '사진톡톡', '게시판', '그래픽', '표', '종합2보', '내일날씨')
    AND NOT brackets_news.title_keyword LIKE '%소식%'
    AND date_format(dt, '%m') = 10
    `;
    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};
exports.setSeries = (seriesData) => {
  return new Promise((resolve, reject) => {
  const sql =
  `
  INSERT INTO series(title, keyword, cnt, create_dt, update_dt)
  VALUE(?, ?, ?, ?, ?)
  `;
  pool.query(sql, [seriesData.title, seriesData.keyword, seriesData.cnt, seriesData.create_dt, seriesData.update_dt], (err, rows) => {
    if (err) {
      console.log(err)
      reject(err);
    } else {
      resolve(rows);
    }
  })
});
};

exports.setSeriesItem = (seriesItemData) => {
  return new Promise((resolve, reject) => {
    const sql = 
    `
    INSERT INTO series_item(series_id, office_id, article_id, is_completed)
    VALUE(?, ?, ?, ?)
    `;
    pool.query(sql, [seriesItemData.series_id, seriesItemData.office_id, seriesItemData.article_id, seriesItemData.is_completed], (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};