
const insert_router = require(`express`).Router();

insert_router.get('/',(req,res) => {
    res.send(`insert router`);
});

module.exports =  insert_router;