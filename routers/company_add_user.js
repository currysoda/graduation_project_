var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');
const { contentSecurityPolicy } = require('helmet');

module.exports = () => {

    router.get('/:company_id', (req, res) => {
        let company_id = req.params.company_id;

        // console.log(company_id);

        res.render(`company_add_user`, { company_id : company_id });
    });



    router.post('/confirm', (req, res) => {

        // console.log(req.session.passport.user.userID);
        // console.log(req.body.company_id);
        // console.log(req.body.email);

        let user_id = req.session.passport.user.userID;
        let company_id = req.body.company_id;
        let applicant_id;
        let applicant_email = req.body.email;
        let res_object = [];

        // console.log(`${typeof(applicant_email)}`);

        async function find_applicant_id() {

            const connection = await db();

            let sql_find_user_id = `SELECT userID FROM user WHERE email = ?;`;
            let values_find_user_id = [applicant_email];

            const [sql_find_user_id_results, sql_find_user_id_fields] = await connection.execute(sql_find_user_id, values_find_user_id);

            applicant_id = await sql_find_user_id_results[0].userID;

            // console.log(`${typeof(applicant_id)}`);
            // console.log(`${applicant_id}`);

            await connection.end();
        }

        async function response() {

            await find_applicant_id();

            await res.send(`post`);
        }

        response();
    });

    return router;
}