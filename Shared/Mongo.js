
const {MongoClient} = require("mongodb");

const client = new MongoClient(process.env.MONGOURL);


const mongo ={

    db:null,
    users:null,
    userinfo:null,

    async connect()
    {
        await client.connect();

        this.db = client.db(process.env.DATABASE);
        this.users = this.db.collection("users");
        this.userinfo = this.db.collection("userinfo");
        console.log("connected to mongodb and dtabase");
    }

}

module.exports = mongo;