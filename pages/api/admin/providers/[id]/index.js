import { getSession } from "next-auth/react";
import Provider from "../../../../../models/Provider";
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
    const provider = await Provider.findById(req.query.id)
        .exec();
    await db.disconnect();
    res.send(provider);
};

const putHandler = async (req, res) => {
    await db.connect();
    console.log(req.body);
    req.body.slug = slugify(req.body.values.razSocial);
    const provider = await Provider.findById(req.query.id);

    if (provider) {
        provider.rut = req.body.values.rut;
        provider.razSocial = req.body.values.razSocial;
        provider.slug = req.body.slug;
        provider.address = req.body.values.address;
        provider.email = req.body.values.email;
        provider.contactNumber = req.body.values.contactNumber;
        provider.credit = req.body.values.credit;
        provider.bornDate = req.body.values.bornDate;
        provider.beginDate = req.body.values.beginDate;
        provider.endDate = req.body.values.endDate;
        provider.image = req.body.values.image;
        await provider.save();
        await db.disconnect();
        res.send({ message: "Provider updated successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Provider not found" });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const provider = await Provider.findById(req.query.id);
    if (provider) {
        await provider.remove();
        await db.disconnect();
        res.send({ message: "Provider deleted successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Provider not found" });
    }
};

export default handler;
