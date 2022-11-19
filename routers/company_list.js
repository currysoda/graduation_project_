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
            let sql = `SELECT companyID FROM user_rel_company_list WHERE userID = ?;`;
            let values = [user_id];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            console.log(typeof(rows));
            console.log(`results : ${inspect(rows)}`);

            await rows.forEach((item, index, array) => {
                console.log(typeof(item.companyID));
                console.log(item.companyID);
                my_company_list_id.push(item.companyID);
            });

            console.log(my_company_list_id);

            await connection.end();
        }

        async function execution_order()
        {
            await find_user_id();
            await my_company_list();
        }

        execution_order();
        

        res.send(`hi`);
    });

    return router;
}