var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);

module.exports = () => {

    router.get('/', (req, res) => {

        // console.log(req.user.id);

        // try {
        //     let sql = `SELECT userID FROM user WHERE email = ?;`;
        //     let values = [req.user.id];

        //     async function search_my_company() {

        //         const connection = await db();

        //         const [rows, fields] = await connection.execute(sql, values);

        //         if (Object.entries(rows).length === 0) {

        //             let sql = `INSERT INTO user(userID, email, password) VALUES(NULL, ?, ?);`;
        //             let values = [req.body.email, req.body.password];

        //             await connection.execute(sql, values);

        //             await connection.end();

        //             res.render(`register_success`);

        //         } else {
        //             await connection.end();

        //             res.render(`register_failure`);
        //         }
        //     }

        //     register_account_db();

        // } catch (err) {
        //     if (err) {
        //         // console.log(`can't connection : ` + err);
        //         res.send(`error`);
        //     }
        // }

        res.send("good");
    });

    return router;
}