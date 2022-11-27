var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = () => {

    router.get('/:company_id', (req, res) => {
        let company_id = req.params.company_id;

        // console.log(company_id);

        res.render(`company_delete_user`, { company_id : company_id });
    });

    router.post('/confirm', (req, res) => { 
        let user_id = req.session.passport.user.userID;
        let company_id = req.body.company_id;
        let fired_user_id = req.body.userID;
        let user_permission_id;

        async function c() {
            const connection = await db();

            // console.log(`user_id : ${user_id} company_id : ${company_id}`);

            let sql_find_permission_id = "SELECT delete_user FROM permission_list WHERE `userID` = ? and `companyID` = ?;";
            let values_find_permission_id = [user_id, company_id];

            const [sql_find_permission_id_results, sql_find_permission_id_fields] = await connection.execute(sql_find_permission_id, values_find_permission_id);

            // console.log(sql_find_permission_id_results);


            user_permission_id = await sql_find_permission_id_results[0].delete_user;

            // console.log(user_permission_id);

            if(user_permission_id == 0) {

                await res.render(`company_delete_user_confirm`, { message : "You don't have permission"});

            } else {

                let sql_delete_user_rel = "DELETE FROM user_rel_company_list WHERE `companyID` = ? AND `userID` = ?;";
                let values_delete_user_rel = [company_id, fired_user_id];

                await connection.execute(sql_delete_user_rel, values_delete_user_rel);

                let sql_delete_permission = "DELETE FROM permission_list WHERE `companyID` = ? AND `userID` = ?;";
                let values_delete_permission = [company_id, fired_user_id];

                await connection.execute(sql_delete_permission, values_delete_permission);

                await res.render(`company_delete_user_confirm`, { message : "your delete_req is complete" });
            }
            await connection.end();
        }

        if(fired_user_id == user_id) {
            res.render(`company_delete_user_confirm`, { message : "you can't delete yourself"});
        }
        else {
            c();
        }
    })

    

    return router;
}