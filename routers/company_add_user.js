var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');
const { contentSecurityPolicy } = require('helmet');

module.exports = () => {

    router.get('/:company_id', (req, res) => {
        let company_id = req.params.company_id;

        // console.log(company_id);

        res.render(`company_add_user`, { company_id : company_id });
    });



    router.post('/confirm', (req, res) => {

        console.log(req.body.company_id);
        console.log(req.body.email);

        res.send(`post`);
    });

    return router;
}