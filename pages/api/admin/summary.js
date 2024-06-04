import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import ProductCategory from "../../../models/ProductCategory";
import Client from "../../../models/Client";
import Provider from "../../../models/Provider";
import Partner from "../../../models/Partner";
import Worker from "../../../models/Worker";
import WorkerCategory from "../../../models/WorkerCategory";
import WorkerPlace from "../../../models/WorkerPlace";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("signin required");
  }

  await db.connect();

  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const productscategoriesCount = await ProductCategory.countDocuments();
  const clientsCount = await Client.countDocuments();
  const providersCount = await Provider.countDocuments();
  const partnersCount = await Partner.countDocuments();
  const workersCount = await Worker.countDocuments();
  const workerscategoriesCount = await WorkerCategory.countDocuments();
  const workersplacesCount = await WorkerPlace.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  await db.disconnect();
  res.send({
    ordersCount,
    productsCount,
    productscategoriesCount,
    clientsCount,
    providersCount,
    partnersCount,
    workersCount,
    workerscategoriesCount,
    workersplacesCount,
    usersCount,
    ordersPrice,
    salesData,
  });
};

export default handler;
