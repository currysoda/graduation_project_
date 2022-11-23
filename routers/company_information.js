var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require(`object-inspect`);

module.exports = () => {

    router.get('/:company_id', (req, res) => {
        let company_id = req.params.company_id;
        let res_object = [];

        async function company_details() {
            const connection = await db();

            let sql_find_company_details = `SELECT * FROM user_rel_company_list WHERE companyID = ?;`;
            let values_find_company_details = [company_id];

            const [sql_find_company_details_results, sql_find_company_details_fields] = await connection.execute(sql_find_company_details, values_find_company_details);

            // console.log(inspect(sql_find_company_details_results));

            res_object = await sql_find_company_details_results;
        }

        async function company_information_router() {
            await company_details();

            await res.render(`company_information`, { company_information : res_object, company_id : company_id });
        }

        company_information_router();
    });

    return router;
}