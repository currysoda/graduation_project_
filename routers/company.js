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

            res.render(`company.pug`);

        } else {
            res.send(`please login`);
        }
    });

    // 소속된 company 확인
    var company_list = require(`./company_list`) ();
    router.use(`/company_list`, company_list);

    // router.get('/create_company', (req, res) => {
    //     // console.log(request.user);
    //     res.render(`create_company.pug`);
    // });

    // router.post('/create_company/confirm', (req, res) => {
    //     // console.log(request.user);

    //     if (req.isAuthenticated()) {

    //         console.log(req.body.company_name);

    //         async function register_company() {
    //             let sql = ` INSERT INTO company_list()
    //                         VALUES(NULL,?);`;
    //             let values = [req.body.company_name];

    //             const connection = await db();
    //             const [rows, fields] = await connection.execute(sql, values);

    //             console.log(rows);
    //         }
    //         register_company();

    //         res.send(req.body.company_name);

    //     } else {
    //         res.send(`please login`);
    //     }
    // });

    // router.get('/company_list', (req, res) => {
    //     // console.log(request.user);
    //     if (req.isAuthenticated()) {

    //         res.render(`company_list.pug`);
    //     } else {
    //         res.send(`please login`);
    //     }
    // });

    return router;
}