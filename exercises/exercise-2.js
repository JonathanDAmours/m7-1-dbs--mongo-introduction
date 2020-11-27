const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercises");

    const result = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, result.insertedCount);

    if (result) {
      res.status(201).json({ status: 201, data: req.body });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: "Error" });
  }

  client.close();
};

const getGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");

  const _id = req.params._id;

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  const db = client.db("exercises");

  db.collection("greetings")
    .find()
    .toArray((err, result) => {
      if (result.length) {
        const start = Number(req.query.start) || 0;
        const cleanStart = start > -1 && start < result.length ? start : 0;

        const end = cleanStart + (Number(req.query.limit) || 25);
        const cleanEnd = end > result.length ? result.length - 1 : end;

        const data = result.slice(cleanStart, cleanEnd);
        res.status(200).json({ status: 200, data });
      } else {
        res.status(404).json({ status: 404, data: "Not Found" });
      }
      client.close();
    });
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");

  try {
    await client.connect();
    const db = client.db("exercises");

    const result = await db
      .collection("greetings")
      .deleteOne({ _id: _id.toUpperCase() });
    assert.equal(1, result.deletedCount);
    res.status(204).json({ status: 204, _id });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id.toUpperCase();
  const query = { _id };

  const newValue = { $set: { hello: req.body.hello } };

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercises");
    if (!req.body.hello) {
      res
        .status(400)
        .json({ status: 400, _id, ...req.body, message: "Unable to update" });
    } else {
      const result = await db
        .collection("greetings")
        .updateOne(query, newValue);
      assert.strictEqual(1, result.matchedCount);
      assert.strictEqual(1, result.modifiedCount);
      res.status(202).json({ status: 202, _id, ...req.body });
    }
  } catch (err) {
    res
      .status(400)
      .json({ status: 400, _id, ...req.body, message: "Unable to update" });
    console.log(err);
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
