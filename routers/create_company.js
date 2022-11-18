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

        let comapny_name = req.body.company_name;
        let chief_email = req.session.passport.user.id;
        let chief_user_id;
        let already_exist = { bool: false };

        async function find_user_id() {
            let sql = `SELECT userID FROM user WHERE email=?;`;
            let values = [chief_email];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            chief_user_id = rows[0].userID;

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows[0].userID)}`);

            await connection.end();
        }

        // find_user_id();

        async function duplicate_check() {
            let sql = `SELECT * FROM company_list WHERE company_name=? AND company_chief_userID=?`;
            let values = [comapny_name, Number(chief_user_id)];

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
        }

        async function registed_company() {
            // create company
            let sql = `INSERT INTO company_list(companyID, company_name, company_chief_userID) VALUES(NULL, ?, ?);`;
            let values = [comapny_name, Number(chief_user_id)];

            const connection = await db();

            const [rows, fields] = await connection.execute(sql, values);

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows)}`);

            // create default team

            // create permission

            // create user_rel_company_list

            await connection.end();
        }

        // registed_company();

        try{
            async function execution_order() {
                await find_user_id();
                await duplicate_check();
                // console.log(already_exist.bool);
                // console.log(typeof(already_exist.bool));
                if(already_exist.bool === true) {
                    res.status(200).render(`already_exist_company`);
                }
                else {
                    await registed_company();
                    res.status(201).render(`create_company_confirm`);
                }
            }

            execution_order();

        } catch(e) {
            res.status(400).render(`create_company_failure`);
        }
    });

    return router;
}