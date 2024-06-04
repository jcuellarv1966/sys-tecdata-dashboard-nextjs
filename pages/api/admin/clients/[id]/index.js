import { getSession } from "next-auth/react";
import Client from "../../../../../models/Client";
import db from "../../../../../utils/db";
const slugify = require("slugify");

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("signin required");
  }

  const { user } = session;
  if (req.method === "GET") {
    return getHandler(req, res, user);
  } else if (req.method === "PUT") {
    return putHandler(req, res, user);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const client = await Client.findById(req.query.id)
    // .populate("category")
    // .populate("subs")
    .exec();
  await db.disconnect();
  res.send(client);
};

const putHandler = async (req, res) => {
  await db.connect();
  console.log(req.body);
  req.body.slug = slugify(req.body.values.razSocial);
  const client = await Client.findById(req.query.id);

  if (client) {
    client.rut = req.body.values.rut;
    client.razSocial = req.body.values.razSocial;
    client.slug = req.body.slug;
    client.address = req.body.values.address;
    client.email = req.body.values.email;
    client.contactNumber = req.body.values.contactNumber;
    client.credit = req.body.values.credit;
    client.bornDate = req.body.values.bornDate;
    client.beginDate = req.body.values.beginDate;
    client.endDate = req.body.values.endDate;
    client.image = req.body.values.image;
    await client.save();
    await db.disconnect();
    res.send({ message: "Client updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Client not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const client = await Client.findById(req.query.id);
  if (client) {
    await client.remove();
    await db.disconnect();
    res.send({ message: "Client deleted successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Client not found" });
  }
};

export default handler;
