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
        process.nextTick(() => {
            // console.log(`${user.email}`);
            // console.log(`${user.userID}`);
            return cb(null, { id: user.email, userID : user.userID });
        });
    });

    passport.deserializeUser(function (user, cb) {
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
            let registed_userID;

            try {
                let sql = `SELECT * FROM user WHERE email = ?;`;
                let values = [username];

                async function comfirm() {
                    const connection = await db();
                    const [rows, fields] = await connection.execute(sql, values);

                    registed_email = rows[0].email;
                    registed_password = rows[0].password;
                    registed_userID = rows[0].userID;

                    // await console.log(`${registed_userID}`);
                }
                await comfirm();

            } catch (err) {
                if (err) {
                    console.log(`can't connection : ` + err);
                }
            }

            if (username === registed_email) {

                if (password === registed_password) {
                    // console.log(`success`);

                    // await console.log(`${registed_userID}`);

                    return done(null, { email : username, password : password, userID : registed_userID });
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