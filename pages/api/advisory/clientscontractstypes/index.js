import { getSession } from "next-auth/react";
import ClientContractType from "../../../../models/ClientContractType";
import db from "../../../../utils/db";

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
    const clientsContractsTypes = await ClientContractType.find({})
        .sort({ name: 1 })
        .exec();
    await db.disconnect();
    res.send(clientsContractsTypes);
};

const postHandler = async (req, res) => {
    await db.connect();
    try {
        console.log(req.body);
        const newClientContractType = await new ClientContractType(req.body).save();
        res.json(newClientContractType);
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
    await db.disconnect();
};

export default handler;