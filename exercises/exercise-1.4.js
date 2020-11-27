const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  const data = req.body;

  if (data) {
    await db.collection("users").insertOne({ name: data.name });
    res.status(201).json({ status: 201, message: `User added.` });
  } else {
    res.status(404).json({ status: 404, message: `No user found.` });
  }

  client.close();
};

module.exports = { addUser };
