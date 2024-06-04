import { getSession } from "next-auth/react";
import Worker from "../../../../../models/Worker";
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
  const worker = await Worker.findById(req.query.id)
    .populate("workerCategory")
    .populate("workerPlace")
    .exec();
  await db.disconnect();
  res.send(worker);
};

const putHandler = async (req, res) => {
  await db.connect();
  console.log(req.body);
  req.body.slug = slugify(req.body.values.lastName);
  const worker = await Worker.findById(req.query.id);

  if (worker) {
    worker.dni = req.body.values.dni;
    worker.rut = req.body.values.rut;
    worker.firstName = req.body.values.firstName;
    worker.lastName = req.body.values.lastName;
    worker.slug = req.body.slug;
    worker.address = req.body.values.address;
    worker.email = req.body.values.email;
    worker.contactNumber = req.body.values.contactNumber;
    worker.workerCategory = req.body.values.workerCategory;
    worker.workerPlace = req.body.values.workerPlace;
    worker.basicSalary = req.body.values.basicSalary;
    worker.bonifications = req.body.values.bonifications;
    worker.foodSupplier = req.body.values.foodSupplier;
    worker.movilizations = req.body.values.movilizations;
    worker.brutSalary = req.body.values.brutSalary;
    worker.discountESSALUD = req.body.values.discountESSALUD;
    worker.discountFONASA = req.body.values.discountFONASA;
    worker.discountAFP = req.body.values.discountAFP;
    worker.totalDiscounts = req.body.values.totalDiscounts;
    worker.percentDiscountESSALUD = req.body.values.percentDiscountESSALUD;
    worker.percentDiscountFONASA = req.body.values.percentDiscountFONASA;
    worker.percentDiscountAFP = req.body.values.percentDiscountAFP;
    worker.netSalary = req.body.values.netSalary;
    worker.bornDate = req.body.values.bornDate;
    worker.bornDate = req.body.values.bornDate;
    worker.beginDate = req.body.values.beginDate;
    worker.endDate = req.body.values.endDate;
    worker.image = req.body.values.image;
    await worker.save();
    await db.disconnect();
    res.send({ message: "Worker updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Worker not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const worker = await Worker.findById(req.query.id);
  if (worker) {
    await worker.remove();
    await db.disconnect();
    res.send({ message: "Worker deleted successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Worker not found" });
  }
};

export default handler;
