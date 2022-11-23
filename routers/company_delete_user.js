var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = () => {

    router.get('/:company_id', (req, res) => {
        let company_id = req.params.company_id;

        console.log(company_id);

        res.send(`여기는 company_delete_user 입니다.`);
    });



    

    return router;
}