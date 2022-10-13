module.exports = (app) => {
    const passport = require(`passport`);
    const LocalStrategy = require(`passport-local`).Strategy;
    const db = require(`./db`);
    const inspect = require(`object-inspect`);

    // var testdata = {
    //     email: `test@test.com`,
    //     password: `1111`
    // };

    passport.serializeUser(function (user, cb) {
        // console.log(`serializeUser`, user);
        process.nextTick(() => {
            cb(null, { id: user.email });
        });
    });

    passport.deserializeUser(function (user, cb) {
        // console.log(`deserializeUser`, user);
        process.nextTick(() => {
            return cb(null, user);
        });
    });

    passport.use(new LocalStrategy(
        {
            usernameField: `email`,
            passwordField: `password`,
            session: true
        }, async function verify(username, password, done) {

            let registed_email = "";
            let registed_password = "";

            // console.log(`LocalStrategy`, username, password);
            try {
                let sql = `SELECT * FROM account WHERE email = ?;`;
                let values = [username];

                async function comfirm() {
                    const connection = await db();
                    const [rows, fields] = await connection.execute(sql, values);

                    registed_email = rows[0].email;
                    registed_password = rows[0].pwd;

                    // console.log(rows[0].email);
                    // console.log(rows[0].pwd);

                    // for(const [key, value] of Object.entries(rows)) {
                    //     console.log(`key : ${key} value : ${value}`);
                    // }

                    // console.log(`rows : `, rows);
                    // console.log(rows[0]);
                    // console.log(rows[0].email);
                    // console.log(rows[0].pwd);
                    // console.log(rows[0][0]);

                    // console.log(`rows : ` + rows[0] + ` rows_type : ` + typeof(rows));

                    // const results = JSON.stringify(rows);

                    // console.log(`rows : ` + results + ` rows_type : ` + typeof(results));
                    // // console.log(`results[0] : ` + results[0] + ` results[length - 1] : ` + results[results.length - 1]);

                    // const results_parse = JSON.parse(results);

                    // console.log(`rows : ` + results_parse + ` rows_type : ` + typeof(results_parse));
                    // console.log(`email : ` + results_parse.email + ` pwd : ` + results_parse.pwd);
                }
                await comfirm();

            } catch (err) {
                if (err) {
                    console.log(`can't connection : ` + err);
                    // res.send(`error`);
                }
            }

            // console.log(`1`);
            // console.log(`username : ` + username + ` password : ` + password);

            // console.log(`username : ` + username);
            // console.log(`registed_email : ` + registed_email);

            // console.log(typeof (username));
            // console.log(typeof (registed_email));

            if (username === registed_email) {
                // console.log(`2`);

                // console.log(`username : ` + password);
                // console.log(`registed_email : ` + registed_password);

                // console.log(typeof (password));
                // console.log(typeof (registed_password));

                if (password === registed_password) {
                    // console.log(`success`);

                    return done(null, { email: username, password: password });
                } else {
                    // console.log(`3`);
                    return done(null, false, {
                        message: `incorrect password`
                    });
                }
            } else {
                // console.log(`4`);
                return done(null, false, {
                    message: `incorrect username`
                });
            }


        }));

    return passport;
}