import { getSession } from "next-auth/react";
import Client from "../../../../models/Client";
import db from "../../../../utils/db";
const slugify = require("slugify");

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (!session || !session.user.isAdmin) {
    return res.status(401).send("admin signin required");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const clients = await Client.find({})
    .sort({ razSocial: 1 })
    // .populate("category")
    // .populate("subs")
    .exec();
  await db.disconnect();
  res.send(clients);
};

const postHandler = async (req, res) => {
  await db.connect();
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.razSocial);
    const newClient = await new Client(req.body).save();
    res.json(newClient);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
  await db.disconnect();
};

export default handler;
