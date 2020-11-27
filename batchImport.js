const fs = require("file-system");
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercises");

    const result = await db.collection("greetings").insertMany(greetings);
    assert.equal(1, result.insertedCount);
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

batchImport();

module.exports = { batchImport };
