var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);

module.exports = () => {

    router.get('/', (req, res) => {

        // req.session.passport.user.id === email 로 유저 식별 
        let user_email = req.session.passport.user.id;
        let user_id;

        async function find_user_id() {
            let sql = `SELECT userID FROM user WHERE email=?;`;
            let values = [user_email];

            const connection = await db();
            const [rows, fields] = await connection.execute(sql, values);

            user_id = rows[0].userID;

            // console.log(typeof(rows));
            // console.log(`results : ${inspect(rows[0].userID)}`);

            await connection.end();
        }

        res.send(`hi`);
    });

    return router;
}