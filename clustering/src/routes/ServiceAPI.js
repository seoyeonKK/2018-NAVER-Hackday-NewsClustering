'use strict';
const tkCtrl =  require('../controllers/TitleKeywordCtrl');
const ckCtrl = require('../controllers/ContentsKeywordCtrl');

module.exports = (router) => {
  router.route('/TitleKeyword')
    .get(tkCtrl.titleKeyword);

  router.route('/ContentsKeyword')
    .get(ckCtrl.contentsKeyword);
  return router;
};
