import { getSession } from "next-auth/react";
import WorkerCategory from "../../../../../models/WorkerCategory";
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
    const workerCategory = await WorkerCategory.findById(req.query.id)
        .exec();
    await db.disconnect();
    res.send(workerCategory);
};

const putHandler = async (req, res) => {
    await db.connect();
    console.log(req.body);
    req.body.slug = slugify(req.body.values.name);
    const workerCategory = await WorkerCategory.findById(req.query.id);

    if (workerCategory) {
        workerCategory.name = req.body.values.name;
        workerCategory.slug = req.body.slug;
        await workerCategory.save();
        await db.disconnect();
        res.send({ message: "Worker Category updated successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Worker Category not found" });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const workerCategory = await WorkerCategory.findById(req.query.id);
    if (workerCategory) {
        await workerCategory.remove();
        await db.disconnect();
        res.send({ message: "Worker Category deleted successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Worker Category not found" });
    }
};

export default handler;
