import { getSession } from "next-auth/react";
import ProductCategory from "../../../../../models/ProductCategory";
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
  const category = await ProductCategory.findById(req.query.id);
  await db.disconnect();
  res.send(category);
};

const putHandler = async (req, res) => {
  await db.connect();
  const category = await ProductCategory.findById(req.query.id);
  if (category) {
    category.name = req.body.values.name;
    category.slug = slugify(req.body.values.name);
    category.images = req.body.values.images;
    await category.save();
    await db.disconnect();
    res.send({ message: "Product Category updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Category not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const category = await ProductCategory.findById(req.query.id);
  if (category) {
    await category.remove();
    await db.disconnect();
    res.send({ message: "Product Category deleted successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Category not found" });
  }
};

export default handler;
