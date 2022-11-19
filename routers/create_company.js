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

        let company_id;
        let team_id;
        let permission_id;
        let company_name = req.body.company_name;
        let chief_email = req.session.passport.user.id;
        let chief_user_id;
        let already_exist = { bool: false };

        async function find_user_id() {
            let sql = `SELECT userID FROM user WHERE email=?;`;
            let values = [chief_email];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            chief_user_id = Number(rows[0].userID);


            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows[0].userID)}`);

            await connection.end();
        }

        // find_user_id();

        async function duplicate_check() {
            let sql = `SELECT * FROM company_list WHERE company_name=? AND company_chief_userID=?`;
            let values = [company_name, chief_user_id];

            const connection = await db();

            const [rows, fields] = await connection.execute(sql, values);

            // console.log(inspect(rows));

            if (Object.entries(rows).length === 0) {
                // console.log("0");
            } else {
                // console.log("1");
                // console.log(already_exist);
                already_exist.bool = true;
                // console.log(already_exist);
            }

            await connection.end();
        }

        async function registed_company() {
            // create company
            let sql_create_company = `INSERT INTO company_list(companyID, company_name, company_chief_userID) VALUES(NULL, ?, ?);`;
            let values_create_company = [company_name, chief_user_id];

            const connection = await db();

            const [rows, fields] = await connection.execute(sql_create_company, values_create_company);

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows)}`);

            // find companyID

            let sql_find_companyID = `SELECT companyID FROM company_list WHERE company_name = ? AND company_chief_userID = ?;`;
            let values_find_companyID = [company_name, chief_user_id];

            const [sql_find_companyID_results, sql_find_companyID_fields] = await connection.execute(sql_find_companyID, values_find_companyID);

            company_id = await sql_find_companyID_results[0].companyID;

            // create default team
            // find team_id

            let sql_create_default_team = `INSERT INTO team_list(teamID, companyID, team_name, team_chief_userID) 
                                           VALUES(NULL, ?, "default_team_name", ?);`;
            let values_create_default_team = [company_id, chief_user_id];

            const [sql_create_default_team_results, sql_create_default_team_fields] = await connection.execute(sql_create_default_team, values_create_default_team);

            let sql_find_team_id = `SELECT teamID FROM team_list WHERE team_name = "default_team_name" AND team_chief_userID = ? AND companyID = ?;`;
            let values_find_team_id = [chief_user_id, company_id];

            const[sql_find_team_id_results, sql_find_team_id_fields] = await connection.execute(sql_find_team_id, values_find_team_id);

            team_id = await sql_find_team_id_results[0].teamID;

            // create permission
            // find permission_id

            let sql_create_permission = `INSERT INTO permission_list(permissionID, companyID, userID, premission_name, search_user, create_user, delete_user)
            VALUES(NULL, ?, ?, "chief", 1, 1, 1);`;
            let values_create_permission = [company_id, chief_user_id];

            const [sql_create_permission_results, sql_create_permission_fields] = await connection.execute(sql_create_permission, values_create_permission);

            let sql_find_permission_id = `SELECT permissionID FROM permission_list WHERE userID = ? AND companyID = ?;`;
            let values_find_permission_id = [chief_user_id, company_id];

            const [sql_find_permission_id_results, values_find_permission_id_fields] = await connection.execute(sql_find_permission_id, values_find_permission_id);

            permission_id = await sql_find_permission_id_results[0].permissionID;

            // create user_rel_company_list

            let sql_create_user_rel_company_list = `INSERT INTO user_rel_company_list(user_rel_companyID, userID, companyID, teamID, permissionID, nick_name, office_position_name, annual_salary, email, phone_number, effective_date, effective_date_termination)
            VALUES(NULL, ?, ?, ?, ?, "test","chief", NULL, ?, NULL,DATE_FORMAT(NOW(),'%Y-%m-%d'), NULL);`;
            let values_create_user_rel_company_list = [chief_user_id, company_id, team_id, permission_id, chief_email];

            const [sql_create_user_rel_company_list_results, sql_create_user_rel_company_list_fields] = await connection.execute(sql_create_user_rel_company_list, values_create_user_rel_company_list);

            await connection.end();
        }

        // registed_company();

        try {
            async function execution_order() {
                await find_user_id();
                await duplicate_check();
                // console.log(already_exist.bool);
                // console.log(typeof(already_exist.bool));
                if (already_exist.bool === true) {
                    res.status(200).render(`already_exist_company`);
                }
                else {
                    await registed_company();
                    res.status(201).render(`create_company_confirm`);
                }
            }

            execution_order();

        } catch (e) {
            res.status(400).render(`create_company_failure`);
        }
    });

    return router;
}