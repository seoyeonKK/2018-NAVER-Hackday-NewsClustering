'use strict';
const pool = require('../../config/DBPool');

exports.getNonBracketNews = () => {
  return new Promise((resolve, reject) => {
    const sql =
    `
    SELECT title, content
    FROM non_brackets_news
    `;
    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
}