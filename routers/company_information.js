var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);

module.exports = () => {

    router.get('/:company_id', (req, res) => {
        res.send(`company_id : ${req.params.company_id}`);
    });

    return router;
}