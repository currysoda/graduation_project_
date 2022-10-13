
module.exports = () => {
    const express = require(`express`)
    const name = express.Router();

    name.get('/', (req, res) => {
        res.render(`login.pug`);
    });

    return name;
}
