var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = () => {

    router.get('/', (req, res) => {

        console.log(`${req.session.passport.user.id}`);

        res.render(`my_information`);
    });

    return router;
}