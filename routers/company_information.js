var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require(`object-inspect`);
var path = require(`path`);

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

            await connection.end();
        }

        async function company_information_router() {
            await company_details();

            await res.render(`company_information`, { company_information: res_object, company_id: company_id });
        }

        company_information_router();
    });

    router.get('/employee_details/:user_id', (req, res) => {
        let employee_id = req.params.user_id;
        let login_user_id = req.session.passport.user.userID;
        let company_id = req.query.company_id;

        async function router_sequence() {

            const connection = await db();

            let sql_find_permission_id = 'SELECT `create_user` FROM `permission_list` WHERE `userID` = ? AND `companyID` = ?;';
            let values_find_permission_id = [login_user_id, company_id];

            const [sql_find_permission_id_results] = await connection.execute(sql_find_permission_id, values_find_permission_id);

            // await console.log(sql_find_permission_id_results[0].create_user);

            if (sql_find_permission_id_results[0].create_user == 1) {
                await connection.end();
                await res.render(`employee_info_update`, { employee_id: employee_id, company_id, company_id });
            } else {
                await connection.end();
                await res.render(`alert.pug`, { message: "permission_deny" });
            }
        }

        router_sequence();
    });

    router.post('/employee_details/update', (req, res) => {
        let nick_name = req.body.nick_name;
        let company_id = req.body.company_id;
        let employee_id = req.body.employee_id;
        let phone_number = req.body.phone_number;
        let position_name = req.body.position_name;
        let annual_salary = req.body.annual_salary;





    })

    return router;
}