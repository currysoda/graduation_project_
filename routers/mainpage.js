var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);

module.exports = (app) => {

    router.get('/', (req, res) => {
        // console.log(request.user);
        if (req.isAuthenticated()) {

            // console.log(req.user.id);
            // console.log(req.session);
            // console.log(req.sessionID);

            res.render(`mainpage.pug`);

        } else {
            res.send(`please login`);
        }
    });

    // 내 정보

    var my_info = require(`./my_information`) ();
    router.use(`/my_information`, my_info);

    // 소속된 company 확인
    var company_list = require(`./company_list`) ();
    router.use(`/company_list`, company_list);

    var create_company_router = require(`./create_company`) ();
    router.use(`/create_company`, create_company_router);

    var work_list_router = require(`./work_list`) ();
    router.use(`/work_list`, work_list_router);

    return router;
}