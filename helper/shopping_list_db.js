const crypto                            = require('crypto');
const {MongoClient, ServerApiVersion}   = require('mongodb');

class ShoppingListDatabase {

    constructor( db_url, db_name ) {
        this.db_url = db_url;
        this.db_name = db_name;
        this.client = new MongoClient(db_url, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
        });
        this.client.connect();
        this.db = this.client.db(db_name);
    }

    async get_all_lists() {
        const list_collection = this.db.collection("shopping_list");
        let queryResult = await list_collection.find({}).toArray();
        return queryResult;
    }

    async create_new_list() {
        let new_list_id = this.#create_new_list_id()
        const list_collection = this.db.collection("shopping_list");
        await list_collection.insertOne({ "list_id": new_list_id, "items": [] });
        return new_list_id;
    }

    async get_list_contents(list_id) {
        const list_collection = this.db.collection("shopping_list");
        let query = { list_id: list_id };
        let result = await list_collection.findOne(query);
        return result.items;
    }
    
    async update_list_contents(list_id, new_contents) {
        const list_collection = this.db.collection("shopping_list");
        let query = { list_id: list_id };
        let new_values = { $set: {items: new_contents}}
        list_collection.updateOne(query, new_values);
    }

    #create_new_list_id() {
        let new_list_id = crypto.randomBytes(20).toString('hex')
        return new_list_id;
    }

}   

module.exports = ShoppingListDatabase;