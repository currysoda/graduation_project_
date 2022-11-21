var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = () => {

    router.get('/', (req, res) => {

        // req.session.passport.user.id === email 로 유저 식별 
        let user_email = req.session.passport.user.id;
        let user_id;
        let my_company_list_id = [];
        let my_company_list_name = [];
        let res_object = [];

        async function find_user_id() {
            let sql = `SELECT userID FROM user WHERE email=?;`;
            let values = [user_email];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            user_id = await Number(rows[0].userID);

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows[0].userID)}`);

            await connection.end();
        }

        async function my_company_list() {
            // find companyID
            let sql = `SELECT companyID FROM user_rel_company_list WHERE userID = ?;`;
            let values = [user_id];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows)}`);

            await rows.forEach((item, index, array) => {
                // console.log(typeof(item.companyID));
                // console.log(item.companyID);
                my_company_list_id.push(item.companyID);
            });

            // console.log(my_company_list_id);

            // find company_list * 

            // console.log(`find_company_list`);

            let sql_find_company = `SELECT * FROM company_list WHERE companyID = ?;`;
            let sql_find_user_name
            await my_company_list_id.forEach(async (item, index, array) => {
                let values_find_company = [item];

                // console.log(`item : ${item}`);

                const [sql_find_company_results, sql_find_company_fields] = await connection.execute(sql_find_company, values_find_company);

                // console.log(sql_find_company_results);

            });


            await connection.end();
        }

        async function execution_order() {
            await find_user_id();
            await my_company_list();
        }

        async function response_f() {

            await execution_order();
            // await console.log(`typeof : ${typeof (my_company_list_id)}`);
            // await console.log(`my_company_list_id : ${my_company_list_id}`);

            await res.render(`my_company_list`, { temp: my_company_list_id });
        }

        response_f();
    });

    return router;
}