var express = require(`express`);
var router = require(`express`).Router();

module.exports = (app) => {

    var logout = require(`./logout`) ();
    router.use(`/logout`, logout);

    router.get('/',(req,res) => {
        // console.log(request.user);
        if(req.isAuthenticated()) {

            res.render(`company.pug`);

        } else { 
            res.send(`please login`);
        }
    });

    router.get('/staff_list',(req,res) => {
        // console.log(request.user);

        res.render(`staff_list.pug`);
    });

    return router;
}