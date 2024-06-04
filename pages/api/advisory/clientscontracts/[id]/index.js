import { getSession } from "next-auth/react";
import ClientContract from "../../../../../models/ClientContract";
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
    const clientContract = await ClientContract.findById(req.query.id)
        // .populate("contractType")
        .populate("client")
        .exec();
    await db.disconnect();
    res.send(clientContract);
}

const putHandler = async (req, res) => {
    await db.connect();
    console.log(req.body);
    const clientContract = await ClientContract.findById(req.query.id);

    if (clientContract) {
        clientContract.numberContract = req.body.values.numberContract;
        clientContract.contractType = req.body.values.contractType;
        clientContract.numberOrder = req.body.values.numberOrder;
        clientContract.numberProject = req.body.values.numberProject;
        clientContract.client = req.body.values.client;
        clientContract.razSocial = req.body.values.razSocial;
        clientContract.observations = req.body.values.observations;
        clientContract.contractItems = req.body.values.contractItems;
        clientContract.subtotal = req.body.values.subtotal;
        clientContract.igv = req.body.values.igv;
        clientContract.total = req.body.values.total;
        clientContract.charges = req.body.values.charges;
        clientContract.balanceOutstanding = req.body.values.balanceOutstanding;
        clientContract.subscriptionDate = req.body.values.subscriptionDate;
        clientContract.startDate = req.body.values.startDate;
        clientContract.endDate = req.body.values.endDate;
        clientContract.cash_credit = req.body.values.cash_credit;
        clientContract.isValid = req.body.values.isValid;
        await clientContract.save();
        await db.disconnect();
        res.send({ message: "Client Contract updated successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Client Contract not found" });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const clientContract = await ClientContract.findById(req.query.id);

    if (clientContract) {
        await clientContract.remove();
        await db.disconnect();
        res.send({ message: "Client Contract deleted successfully" });
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Client Contract not found" });
    }
}

export default handler;