import { getSession } from "next-auth/react";
import WorkerPlace from "../../../../../models/WorkerPlace";
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
    const workerPlace = await WorkerPlace.findById(req.query.id)
        .populate("workerCategory")
        .exec();
    await db.disconnect();
    res.send(workerPlace);
};

const putHandler = async (req, res) => {
    await db.connect();
    console.log(req.body);
    req.body.slug = slugify(req.body.values.name);
    const workerPlace = await WorkerPlace.findById(req.query.id);

    if (workerPlace) {
        workerPlace.name = req.body.values.name;
        workerPlace.slug = req.body.slug;
        workerPlace.workerCategory = req.body.values.workerCategory;
        workerPlace.basicSalary = req.body.values.basicSalary;
        workerPlace.bonifications = req.body.values.bonifications;
        workerPlace.foodSupplier = req.body.values.foodSupplier;
        workerPlace.movilizations = req.body.values.movilizations;
        workerPlace.brutSalary = req.body.values.brutSalary;
        await workerPlace.save();
        await db.disconnect();
        res.send({ message: "Worker Place updated successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Worker Place not found" });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const workerPlace = await WorkerPlace.findById(req.query.id);
    if (workerPlace) {
        await workerPlace.remove();
        await db.disconnect();
        res.send({ message: "Worker Place deleted successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "WorkerPlace not found" });
    }
};

export default handler;
