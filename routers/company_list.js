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
        let chief_user_id = [];
        let my_company_list_name = [];
        let res_object = [];
        let res_json;

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

            await rows.forEach(async (item, index, array) => {
                // console.log(typeof(item.companyID));
                // console.log(item.companyID);
                await my_company_list_id.push(item.companyID);
            });

            // console.log(my_company_list_id);

            // find company_list * 

            // console.log(`find_company_list`);

            let sql_find_company = `SELECT * FROM company_list WHERE companyID = ?;`;
            await my_company_list_id.forEach(async (item, index, array) => {
                let values_find_company = [item];

                // console.log(`item : ${item}`);

                const [sql_find_company_results, sql_find_company_fields] = await connection.execute(sql_find_company, values_find_company);

                // console.log(`item : ${item} index : ${index} results : ${inspect(sql_find_company_results[0])}`);

                // await console.log(`sql_find_company_results[0].company_chief_userID : ${sql_find_company_results[0].company_chief_userID}`);

                await chief_user_id.push(sql_find_company_results[0].company_chief_userID);
                await res_object.push(sql_find_company_results[0]);
            });

            await connection.end();
        }

        async function find_user_nick_name() {
            const connection = await db();
            // find user nick_name

            // await console.log(chief_user_id);
            let sql_find_user_name = `SELECT nick_name FROM user_rel_company_list WHERE userID = ?;`
            await chief_user_id.forEach(async (item, index, array) => {
                let values_find_user_name = [item];

                // console.log(`item : ${item}`);

                const [sql_find_user_name_results, sql_find_user_name_fields] = await connection.execute(sql_find_user_name, values_find_user_name);

                // console.log(`find_user_name : ${inspect(sql_find_user_name_results[0].nick_name)}`);

                res_object[index].nick_name = await sql_find_user_name_results[0].nick_name;

            });


            await connection.end();
        }

        async function execution_order() {
            await find_user_id();
            await my_company_list();
            await find_user_nick_name();
        }

        async function response_f() {

            await execution_order();
            // await console.log(`typeof : ${typeof (my_company_list_id)}`);
            // await console.log(`my_company_list_id : ${my_company_list_id}`);

            // await console.log(`res_object : ${inspect(res_object)}`);
            // await console.log(`res_object : ${typeof(res_object)}`);
            // await console.log(`res_object : ${typeof(inspect(res_object))}`);

            // res_json = await JSON.stringify(res_object);
            // res_json = await res_json.substring(1, res_json.length - 1);

            // await res_json.replace("[", "");
            // await res_json.replace("]", "");
            

            // await console.log(`res_json : ${res_json}`);
            // await console.log(`res_json : ${typeof(res_json)}`);

            // await console.log(`res_json : ${res_json[0]}`);

            await res.render(`my_company_list`, { temp : res_object });
        }

        response_f();
    });

    var company_information = require(`./company_information`) ();
    router.use(`/`, company_information);

    return router;
}