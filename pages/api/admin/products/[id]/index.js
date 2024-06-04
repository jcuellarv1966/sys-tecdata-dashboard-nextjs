import { getSession } from "next-auth/react";
import Product from "../../../../../models/Product";
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
  const product = await Product.findById(req.query.id)
    // .populate("category")
    // .populate("subs")
    .exec();
  await db.disconnect();
  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();
  console.log(req.body);
  req.body.slug = slugify(req.body.values.title);
  const product = await Product.findById(req.query.id);

  if (product) {
    product.title = req.body.values.title;
    product.slug = req.body.slug;
    product.category = req.body.values.category;
    product.images = req.body.values.images;
    product.price = req.body.values.price;
    product.brand = req.body.values.brand;
    product.countInStock = req.body.values.countInStock;
    product.description = req.body.values.description;
    product.featuredImage = req.body.values.featuredImage;
    product.isFeatured = req.body.values.isFeatured;
    await product.save();
    await db.disconnect();
    res.send({ message: "Product updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "Product deleted successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

export default handler;
