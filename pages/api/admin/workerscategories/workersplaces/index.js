import { getSession } from "next-auth/react";
import WorkerPlace from "../../../../../models/WorkerPlace";
import db from "../../../../../utils/db";

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

const postHandler = async (req, res) => {
  console.log(req.body.selectedCategory);
  await db.connect();
  WorkerPlace.find({ workerCategory: req.body.selectedCategory })
    .populate("workerCategory")
    .sort({ name: 1 })
    .exec((err, subs) => {
      if (err) console.log(err);
      res.json(subs);
    });
  await db.disconnect();
};

const getHandler = async (req, res) => {
  await db.connect();
  WorkerPlace.findById(req.query.id)
    .populate("workerCategory")
    .exec((err, subs) => {
      if (err) console.log(err);
      res.json(subs);
    });
  await db.disconnect();
};

export default handler;
