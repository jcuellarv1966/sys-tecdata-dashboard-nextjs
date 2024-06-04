import { getSession } from "next-auth/react";
import ClientContractClause from "../../../../models/ClientContractClause";
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
    const clientContractClauses = await ClientContractClause.find({})
        .exec();
    await db.disconnect();
    res.send(clientContractClauses);
};

const postHandler = async (req, res) => {
    await db.connect();
    try {
        console.log(req.body);
        const newClientContractClause = await new ClientContractClause(req.body).save();
        res.json(newClientContractClause);
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
    await db.disconnect();
};

export default handler;