var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = () => {

    router.get('/', (req, res) => {
        let user_email = req.session.passport.user.id;
        let user_id;
        let res_object = [];

        // console.log(`${req.session.passport.user.id}`);

        async function find_my_information() {

            const connection = await db();

            let sql_find_user_id = `SELECT userID FROM user WHERE email=?;`;
            let values_find_user_id = [user_email];

            const [sql_find_user_id_results, sql_find_user_id_fields] = await connection.execute(sql_find_user_id, values_find_user_id);

            // console.log(typeof(sql_find_user_id_results[0].userID));
            // console.log(sql_find_user_id_results[0].userID);

            user_id = await sql_find_user_id_results[0].userID;

            // console.log(user_id);
            // console.log(typeof(user_id));

            let sql_find_my_information = "SELECT * FROM user_rel_company_list NATURAL JOIN company_list WHERE userID = ? ORDER BY `companyID`;";
            let values_find_my_information = [user_id];

            const [sql_find_my_information_results, sql_find_my_information_fields] = await connection.execute(sql_find_my_information, values_find_my_information);

            // console.log(typeof(sql_find_my_information_results));
            // console.log(inspect(sql_find_my_information_results));

            res_object = await sql_find_my_information_results;

            // console.log(typeof(res_object));
            // console.log(inspect(res_object));

        }

        async function my_information_router() {

            await find_my_information();

            await res.render(`my_information`, { my_information : res_object, my_user_id : user_id, my_email : user_email });
        }

        my_information_router();
    });

    return router;
}