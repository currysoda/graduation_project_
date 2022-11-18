var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = () => {

    router.get('/', (req, res) => {

        res.status(200).render(`create_company.pug`);
    });

    router.post('/confirm', (req, res) => {

        // console.log(`req.body.company_name : ${req.body.company_name}`);
        // console.log(req.session.passport.user.id);

        let comapny_name = req.body.company_name;
        let chief_email = req.session.passport.user.id;
        let chief_user_id;

        async function find_user_id() {
            let sql = `SELECT userID FROM user WHERE email=?;`;
            let values = [chief_email];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            chief_user_id = rows[0].userID;

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows[0].userID)}`);

            await connection.end();
        }

        // find_user_id();

        async function registed_company() {

            let sql = `INSERT INTO company_list(companyID, company_name, company_chief_userID) VALUES(NULL, ?, ?);`;
            let values = [comapny_name, Number(chief_user_id)];

            const connection = await db();

            const [rows, fields] = await connection.execute(sql, values);

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows)}`);

            await connection.end();
        }

        // registed_company();

        try{
            async function execution_order() {
                await find_user_id();
                await registed_company();
            }
            execution_order();

            res.status(201).render(`create_company_confirm`);

        } catch(e) {
            res.status(400).render(`create_company_failure`);
        }
    });

    return router;
}