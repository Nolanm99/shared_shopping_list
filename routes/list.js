const express               = require('express');
const config                = require('config');
const ShoppingListDatabase  = require('../helper/shopping_list_db');
const router                = express.Router();


db_url = process.env.DB_URL || config.URL;
db_name = process.env.DB_NAME || config.NAME;
shopping_list_db = new ShoppingListDatabase(db_url, db_name);

router.get('/', async (req, res, next) => {
    all_lists = await shopping_list_db.get_all_lists();
    console.log(all_lists);
    res.render('index', {
        title: 'Noted.zip',
        app_version: config.APP_VERSION
    });
});

router.get('/new_list', async (req, res, next) => {
    new_list_id = await shopping_list_db.create_new_list();
    console.log(new_list_id);
    res.redirect(`/list/${new_list_id}`);
});

router.get('/:list_id', async (req, res, next) => {
    var list_id = req.params.list_id
    var list_contents = await shopping_list_db.get_list_contents(list_id);
    res.render('list', {
        title: "List | Noted.zip",
        app_version: config.APP_VERSION,
        items: Object.values(list_contents),
        list_id: list_id
    });
})

router.post('/update_list', async (req, res, next) => {
    let new_list_contents = req.body.new_list_contents;
    let list_id = req.body.list_id;
    await shopping_list_db.update_list_contents(list_id, new_list_contents);
})

module.exports = router;
