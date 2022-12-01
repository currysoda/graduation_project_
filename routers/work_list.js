var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');

module.exports = (app) => {

    router.get('/', (req, res) => {

        let user_id = req.session.passport.user.userID;
        let my_company_id_list = [];
        let res_object = [];


        async function work_list() {
            const connection = await db();

            let sql_find_company_list = `SELECT companyID FROM user_rel_company_list WHERE userID = ?;`;
            let values_find_company_list = [user_id];

            const [sql_find_company_list_results] = await connection.execute(sql_find_company_list, values_find_company_list);

            // await console.log(inspect(sql_find_company_list_results));

            await sql_find_company_list_results.forEach(async (item, index, array) => {

                await my_company_id_list.push(item.companyID);
            });

            // await console.log(inspect(my_company_id_list));

            // await console.log(typeof(my_company_id_list[0]));

            await connection.end();

            // await console.log(my_company_id_list);

            let index = 0;
            async function for_loop() {
                for (const item of my_company_id_list) {
                    // console.log(`item : ${item}`);
                    const connection = await db();

                    // let index_number = index;
                    let sql_find_company = "SELECT * FROM `company_list` WHERE `companyID` = ?;";
                    let values_find_company = [item];

                    const [sql_find_company_results, sql_find_company_fields] = await connection.execute(sql_find_company, values_find_company);

                    // await console.log(`index : ${index} | results : ${inspect(sql_find_company_results[0])}`);

                    // await console.log(`${typeof(sql_find_company_results)}`);
                    // await console.log(`${typeof(sql_find_company_results[0])}`);

                    // await console.log(index);
                    // await console.log(typeof(index));

                    // res_object[index].index = await index_number;
                    // res_object[index].company_info = await sql_find_company_results[0];

                    await res_object.push(sql_find_company_results[0]);

                    let sql_find_work_list = "SELECT * FROM `work_list` WHERE `companyID` = ?;";
                    let values_find_work_list = [item];

                    const [sql_find_work_list_results] = await connection.execute(sql_find_work_list, values_find_work_list);

                    // await console.log(inspect(sql_find_work_list_results));

                    res_object[index].work_list = await sql_find_work_list_results;

                    await connection.end();

                    index++;
                }
                index = 0;


            }

            await for_loop();
        }

        async function router_sequence() {

            await work_list();

            // await console.log(`res_object : ${inspect(res_object)}`);

            await res.render(`work_list`, { res_object : res_object });

        }
        router_sequence();
    });

    router.get(`/:company_id`, (req, res) => {
        let company_id = req.params.company_id;
        // console.log(company_id);

        res.render(`work_add.pug`, { company_id : company_id });
    });

    router.post(`/work_add_confirm`, (req, res) => {
        let company_id = req.body.company_id;
        let work_name = req.body.work_name;
        let work_description = req.body.work_description;

        // console.log(company_id);
        // console.log(work_name);
        // console.log(work_description);

        async function work_add() {
            const connection = await db();

            let sql_create_work = "INSERT INTO work_list(workID, companyID, work_name, work_description) VALUES(NULL, ?, ?, ?);";
            let values_create_work = [company_id, work_name, work_description];

            await connection.execute(sql_create_work, values_create_work);

            await connection.end();
            await res.redirect(`/mainpage/work_list`);
        }

        work_add();
    });

    router.get(`/work_delete/:work_id`, (req, res) => {
        let work_id = req.params.work_id;

        // console.log(work_id);
        
        async function router_sequence() {
            let sql_delete_work = "DELETE FROM work_list WHERE `workID` = ?;";
            let values_delete_work = [work_id];

            let sql_delete_work_file = "DELETE FROM work_file_list WHERE `workID` = ?;";
            let values_delete_work_file = [work_id];

            const connection = await db();

            await connection.execute(sql_delete_work, values_delete_work);
            await connection.execute(sql_delete_work_file, values_delete_work_file);

            await connection.end();
            await res.redirect(`/mainpage/work_list`);
        }

        router_sequence();
    });

    var work_files_router = require(`./work_files`) (app);
    router.use(`/work_files`, work_files_router);

    return router;
}