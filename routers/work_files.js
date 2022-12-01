var express = require(`express`);
var router = require(`express`).Router();
var db = require(`../lib/db`);
var inspect = require('object-inspect');
const multer = require('multer')
const upload = multer({ dest: '../public/work_folder' })
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
const { contentSecurityPolicy } = require('helmet');

module.exports = (app) => {

    router.get(`/:work_id`, (req, res) => {
        let work_id = req.params.work_id;
        let res_object = [];

        async function router_sequence() {

            let sql_find_work_file_list = "SELECT `dummyID`,`workID`,`original_file_name` FROM work_file_list WHERE `workID` = ?;";
            let values_find_work_file_list = [work_id];
            

            // await console.log(`${work_id}`);
            const connection = await db();

            const [sql_find_work_file_list_results] = await connection.execute(sql_find_work_file_list, values_find_work_file_list);

            // await console.log(inspect(sql_find_work_file_list_results));
            res_object = await sql_find_work_file_list_results;
            await connection.end();
        }

        async function response_f() {
            await router_sequence();

            // await console.log(inspect(res_object));

            await res.render(`work_files_list`, { work_id : work_id, work_files_list : res_object});
        }

        response_f();
    })

    router.get(`/:work_id/work_files_add`, (req, res) => {
        let work_id = req.params.work_id;
        let company_id;

        // console.log(`${work_id}`);

        async function router_sequence() {

            let sql_find_work_id = "SELECT `companyID` FROM `work_list` WHERE `workID` = ?;";
            let values_find_work_id = [work_id];

            // await console.log(`${work_id}`);

            const connection = await db();

            const [sql_find_work_id_results] = await connection.execute(sql_find_work_id, values_find_work_id);

            // await console.log(`${sql_find_work_id_results[0].companyID}`);

            company_id = sql_find_work_id_results[0].companyID;

            // await console.log(typeof(company_id));

            await connection.end();

        }

        async function response_f() {
            await router_sequence();

            await res.render(`work_files_add`, { work_id: work_id, company_id: company_id });
        }

        response_f();
    });

    router.post(`/work_files_add/confirm`, upload.single('upload_file'), (req, res) => {
        let work_id = req.body.work_id;
        let company_id = req.body.company_id;
        let upload_file = req.file;

        // console.log(work_id);
        // console.log(company_id);
        // console.log(upload_file);
        // console.log(upload_file.fieldname);
        // console.log(upload_file.originalname);
        // console.log(typeof(upload_file.originalname));
        upload_file.originalname = iconv.decode(upload_file.originalname, 'utf-8');
        // console.log(upload_file);
        // console.log(str_temp);
        // console.log(decodeURI(upload_file.originalname));
        // console.log(typeof(upload_file.mimetype));

        async function router_sequence() {

            let sql_create_work_file = "INSERT INTO work_file_list(dummyID,workID,original_file_name,convert_file_name) VALUES(NULL,?,?,?);";
            let values_create_work_file = [work_id, upload_file.originalname, upload_file.filename];

            // await console.log(`${work_id}`);
            const connection = await db();
            await connection.execute(sql_create_work_file, values_create_work_file);
            await connection.end();
        }

        async function response_f() {
            await router_sequence();

            await res.send(`HOST/mainpage/work_list/work_files/work_files_add/confirm`);
        }

        response_f();
    });

    router.get(`/:dummy_id/download`, (req, res) => {
        let dummy_id = req.params.dummy_id;
        let server_filename;
        let download_path;
        let original_name;

        async function find_file_name() {
            let sql_find_file_name = "SELECT `original_file_name`, `convert_file_name` FROM work_file_list WHERE `dummyID` = ?;";
            let values_find_file_name = [dummy_id];

            const connection = await db();
            const [sql_find_file_name_results] = await connection.execute(sql_find_file_name, values_find_file_name);
            await connection.end();

            server_filename = await sql_find_file_name_results[0].convert_file_name;
            original_name = await sql_find_file_name_results[0].original_file_name;

            // await console.log(inspect(sql_find_file_name_results));
            // await console.log(inspect(sql_find_file_name_results[0].convert_file_name));

            download_path = await path.join('..', 'public', 'work_folder', server_filename);

            // await console.log(download_path);

            // await console.log(typeof(original_name));
            
            await res.download(download_path, original_name, (err) => {
                if(err) {
                    console.log(err);
                }
            });
        }
        find_file_name();
        // console.log(dummy_id);
    });

    return router;
}