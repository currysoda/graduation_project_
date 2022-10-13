var express = require(`express`);
var router = require(`express`).Router();

module.exports = () => {

    router.get(`/`,(req, res) => {
        // console.log(`logout`);

        req.session.destroy();
        req.session = null;

        // 메인 페이지로 
        res.redirect(`/`);
    });

    return router;
}