var express = require(`express`);
var router = require(`express`).Router();

module.exports = () => {

    router.get(`/`,(req, res) => {
        // console.log(`logout`);

        console.log(req.sessionID);

        req.session.destroy();
        req.session = null;

        // 메인 페이지로 
        res.redirect(`/`);
    });

    return router;
}