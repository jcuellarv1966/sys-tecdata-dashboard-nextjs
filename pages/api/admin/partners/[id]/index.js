import { getSession } from "next-auth/react";
import Partner from "../../../../../models/Partner";
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
    const partner = await Partner.findById(req.query.id)
        .exec();
    await db.disconnect();
    res.send(partner);
};

const putHandler = async (req, res) => {
    await db.connect();
    console.log(req.body);
    req.body.slug = slugify(req.body.values.razSocial);
    const partner = await Partner.findById(req.query.id);

    if (partner) {
        partner.rut = req.body.values.rut;
        partner.razSocial = req.body.values.razSocial;
        partner.slug = req.body.slug;
        partner.address = req.body.values.address;
        partner.email = req.body.values.email;
        partner.contactNumber = req.body.values.contactNumber;
        partner.credit = req.body.values.credit;
        partner.bornDate = req.body.values.bornDate;
        partner.beginDate = req.body.values.beginDate;
        partner.endDate = req.body.values.endDate;
        partner.image = req.body.values.image;
        await partner.save();
        await db.disconnect();
        res.send({ message: "Partner updated successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Partner not found" });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const partner = await Partner.findById(req.query.id);
    if (partner) {
        await partner.remove();
        await db.disconnect();
        res.send({ message: "Partner deleted successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Partner not found" });
    }
};

export default handler;
