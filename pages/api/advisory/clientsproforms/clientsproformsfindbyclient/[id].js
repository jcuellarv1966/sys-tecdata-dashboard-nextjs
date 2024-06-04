import { getSession } from "next-auth/react";
import ClientProform from "../../../../../models/ClientProform";
import db from "../../../../../utils/db";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session || !session.user.isAdmin) {
        return res.status(401).send("admin signin required");
    }

    if (req.method === "GET") {
        return getHandler(req, res);
    } else {
        return res.status(400).send({ message: "Method not allowed" });
    }
};

const getHandler = async (req, res) => {
    await db.connect();
    const clientProforns = await ClientProform.find({ client: req.query.id })
        .sort({ issueDate: 1 })
        .populate("client")
        .exec();

    if (clientProforns.length > 0) {
        await db.disconnect();
        res.send(clientProforns);
    } else {
        await db.disconnect();
        res.status(404).send({ message: "Client Proforms not found" });
    }
};

export default handler;