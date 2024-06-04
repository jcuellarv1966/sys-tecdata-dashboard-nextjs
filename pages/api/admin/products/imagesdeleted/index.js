import { getSession } from "next-auth/react";
import fs from "fs";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("signin required");
  }

  const { user } = session;
  if (req.method === "POST") {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const deleteHandler = async (req, res) => {
  const DIR = "./public/uploads/products";
  fs.unlinkSync(DIR + "/" + req.body.file);
  return res.status(200).send("Successfully! Image has been Deleted");
};

export default handler;
