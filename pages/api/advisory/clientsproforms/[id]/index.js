import { getSession } from "next-auth/react";
import ClientProform from "../../../../../models/ClientProform";
import db from "../../../../../utils/db";

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
    const clientProform = await ClientProform.findById(req.query.id)
        .populate("client")
        .exec();
    await db.disconnect();
    res.send(clientProform);
}

const putHandler = async (req, res) => {
    await db.connect();
    console.log(req.body);
    const clientProform = await ClientProform.findById(req.query.id);

    if (clientProform) {
        clientProform.numberProform = req.body.values.numberProform;
        clientProform.client = req.body.values.client;
        clientProform.razSocial = req.body.values.razSocial;
        clientProform.observations = req.body.values.observations;
        clientProform.proformItems = req.body.values.proformItems;
        clientProform.subtotal = req.body.values.subtotal;
        clientProform.igv = req.body.values.igv;
        clientProform.total = req.body.values.total;
        clientProform.issueDate = req.body.values.issueDate;
        clientProform.receptionDate = req.body.values.receptionDate;
        clientProform.acceptanceDate = req.body.values.acceptanceDate;
        clientProform.acceptance = req.body.values.acceptance;
        await clientProform.save();
        await db.disconnect();
        res.send({ message: "Client Proform updated successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Client Proform not found" });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const clientProform = await ClientProform.findById(req.query.id);

    if (clientProform) {
        await clientProform.remove();
        await db.disconnect();
        res.send({ message: "Client Proform deleted successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Client Proform not found" });
    }
}

export default handler;