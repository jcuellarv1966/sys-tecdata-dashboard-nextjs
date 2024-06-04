import { getSession } from "next-auth/react";
import WorkerCategory from "../../../../models/WorkerCategory";
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
    const categories = await WorkerCategory.find({}).sort({ name: 1 });
    await db.disconnect();
    res.send(categories);
};

const postHandler = async (req, res) => {
    await db.connect();
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.name);
        const newWorkerCategory = await new WorkerCategory(req.body).save();
        res.json(newWorkerCategory);
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
    await db.disconnect();
};

export default handler;
