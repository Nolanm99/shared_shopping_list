const express               = require('express');
const config                = require('config');
const ShoppingListDatabase  = require('../helper/shopping_list_db');
const router = express.Router();
const DB_CONFIG = config.DB_CONFIG;


shopping_list_db = new ShoppingListDatabase(DB_CONFIG.URL, DB_CONFIG.NAME);

router.get('/', async (req, res, next) => {
    all_lists = await shopping_list_db.get_all_lists();
    console.log(all_lists);
    res.render('index', { title: 'Express' });
});

router.get('/new_list', async (req, res, next) => {
    new_list_id = await shopping_list_db.create_new_list();
    console.log(new_list_id);
    res.redirect(`/list/${new_list_id}`);
});

router.get('/:list_id', async (req, res, next) => {
    var list_id = req.params.list_id
    var list_contents = await shopping_list_db.get_list_contents(list_id);
    console.log(Object.values(list_contents));
    res.render('list', {
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
