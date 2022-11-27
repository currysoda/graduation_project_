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
        let no_exist_user;
        let already_exist;
        let team_id;
        let applicant_permission_id;
        let user_permission_id;
        let permission_exist = false;

        // console.log(`${typeof(applicant_email)}`);

        async function find_applicant_id() {

            const connection = await db();

            let sql_find_user_id = `SELECT userID FROM user WHERE email = ?;`;
            let values_find_user_id = [applicant_email];

            const [sql_find_user_id_results, sql_find_user_id_fields] = await connection.execute(sql_find_user_id, values_find_user_id);

            // console.log(sql_find_user_id_results);

            if(Object.entries(sql_find_user_id_results).length === 0) {

                no_exist_user = await true;

            } else {
                let sql_find_user_permission_id = `SELECT create_user FROM permission_list WHERE userID = ? AND companyID = ?;`;
                let values_find_user_permission_id = [user_id,company_id];

                const [sql_find_user_permission_id_results, sql_find_permission_id_fields] = await connection.execute(sql_find_user_permission_id, values_find_user_permission_id);

                // console.log(inspect(sql_find_user_permission_id_results[0].create_user));

                user_permission_id = await sql_find_user_permission_id_results[0].create_user

                if(user_permission_id == 1) {
                    permission_exist = await true;
                }

                no_exist_user = await false;
                applicant_id = await sql_find_user_id_results[0].userID;

                let sql_find_user_already_exist = `SELECT companyID FROM user_rel_company_list WHERE userID = ?;`;
                let values_find_user_already_exist = [applicant_id];

                const [sql_find_user_already_exist_results, sql_find_user_already_exist_fields] = await connection.execute(sql_find_user_already_exist, values_find_user_already_exist);

                // await console.log(inspect(sql_find_user_already_exist_results));

                await sql_find_user_already_exist_results.forEach(async (item, index, array) => {
                    // await console.log(`companyID : ${item.companyID}`);
                    if(item.companyID == company_id) {
                        // await console.log(`존재함`);
                        already_exist = await true;
                    }
                });

                if(already_exist == true) {
                    
                }
                else {
                    // console.log(`${typeof(applicant_id)}`);
                    // console.log(`${applicant_id}`);

                    let sql_find_team_id = `SELECT teamID FROM team_list WHERE team_name = "default_team_name" AND companyID = ?;`;
                    let values_find_team_id = [company_id];

                    const [sql_find_team_id_results, sql_find_team_id_fields] = await connection.execute(sql_find_team_id,values_find_team_id);

                    // await console.log(inspect(sql_find_team_id_results[0].teamID));

                    team_id = await sql_find_team_id_results[0].teamID;

                    let sql_create_permission = `INSERT INTO permission_list(permissionID, companyID, userID, permission_name, search_user, create_user, delete_user)
                    VALUES(NULL, ?, ?, default, 1, 0, 0);`;
                    let values_create_permission = [company_id, applicant_id];

                    await connection.execute(sql_create_permission, values_create_permission);

                    let sql_find_applicant_permission_id = `SELECT permissionID FROM permission_list WHERE userID = ? AND companyID = ?;`;
                    let values_find_applicant_permission_id = [applicant_id, company_id];

                    const [sql_find_applicant_permission_id_results, sql_find_applicant_permission_id_fields] = await connection.execute(sql_find_applicant_permission_id, values_find_applicant_permission_id);

                    applicant_permission_id = await sql_find_applicant_permission_id_results[0].permissionID;

                    let sql_create_applicant = `INSERT INTO user_rel_company_list(user_rel_companyID, userID, companyID, teamID, permissionID, nick_name, office_position_name, annual_salary, email, phone_number, effective_date, effective_date_termination)
                    VALUES(NULL, ?, ?, ?, ?, default, "clerk", NULL, NULL, NULL,DATE_FORMAT(NOW(),'%Y-%m-%d'), NULL);`;
                    let values_create_applicant = [applicant_id, company_id, team_id, applicant_permission_id];

                    await connection.execute(sql_create_applicant, values_create_applicant);
                }
            }
            
            await connection.end();
        }

        async function response() {

            await find_applicant_id();

            if(no_exist_user == true) {
                await res.render(`company_add_user_confirm`, { message : "no_exist" });
            }
            else if(already_exist == true) {
                await res.render(`company_add_user_confirm`, { message : "already_exist" });
            }
            else if(permission_exist == false){
                await res.render(`company_add_user_confirm`, { message : "you don't have permission" });
            }
            else {
                await res.render(`company_add_user_confirm`, { message : "complete add user" });
            }
        }

        response();
    });

    return router;
}