const main_router = require(`express`).Router();

main_router.get('/',(req,res) => {
    res.render(`main.pug`);
});


module.exports = main_router;
