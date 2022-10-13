var express = require(`express`);
var router = require(`express`).Router();

module.exports = (app, passport) => {

    router.get('/login', function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log(`이미 로그인 됨`);
            res.redirect('/company')
        } else {
            res.render('login.pug');
        }
    });

    router.post('/login/password', passport.authenticate('local', {
        // 시작이 root router 에서 시작함
        successRedirect: '/company',
        failureRedirect: '/login'
        })
    );

    return router;
};

