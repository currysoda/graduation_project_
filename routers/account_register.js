const { dnsPrefetchControl } = require("helmet");
var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
const { json } = require("body-parser");

module.exports = (app) => {

    router.get(`/`, (req, res) => {
        // console.log(`register ID`);
        res.render(`register.pug`);
    });

    router.post(`/register_confirm`, (req, res) => {

        // console.log(`req.body.email : ${req.body.email} \n`);
        // console.log(`req.body.password : ${req.body.password} \n`);

        try {
            let sql = `SELECT email FROM user WHERE email = ?;`;
            let values = [req.body.email];

            async function register_account_db() {

                const connection = await db();

                const [rows, fields] = await connection.execute(sql, values);

                if (Object.entries(rows).length === 0) {

                    let sql = `INSERT INTO user(userID, email, password) VALUES(NULL, ?, ?);`;
                    let values = [req.body.email, req.body.password];

                    await connection.execute(sql, values);

                    await connection.end();

                    res.render(`register_success`);

                } else {
                    await connection.end();

                    res.render(`register_failure`);
                }
            }

            register_account_db();

        } catch (err) {
            if (err) {
                // console.log(`can't connection : ` + err);
                res.send(`error`);
            }
        }
    });
    return router;
}
