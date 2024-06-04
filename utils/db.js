import mongoose from 'mongoose';

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.category = JSON.parse(JSON.stringify(doc.category));
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

function convertDocToObjClient(doc) {
  doc._id = doc._id.toString();
  doc.bornDate = doc.bornDate.toString();
  if (doc.bornDate) { doc.bornDate = doc.bornDate.toString(); }
  if (doc.beginDate) { doc.beginDate = doc.beginDate.toString(); }
  if (doc.endDate) { doc.endDate = doc.endDate.toString(); }
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

function convertDocToObjWorker(doc) {
  doc._id = doc._id.toString();
  doc.workerCategory = JSON.parse(JSON.stringify(doc.workerCategory));
  doc.workerPlace = JSON.parse(JSON.stringify(doc.workerPlace));
  if (doc.bornDate) { doc.bornDate = doc.bornDate.toString(); }
  if (doc.beginDate) { doc.beginDate = doc.beginDate.toString(); }
  if (doc.endDate) { doc.endDate = doc.endDate.toString(); }
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

function convertDocToObjClientProform(doc) {
  doc._id = doc._id.toString();
  doc.client = JSON.parse(JSON.stringify(doc.client));
  doc.proformItems = JSON.parse(JSON.stringify(doc.proformItems));
  if (doc.issueDate) { doc.issueDate = doc.issueDate.toString(); }
  if (doc.receptionDate) { doc.receptionDate = doc.receptionDate.toString(); }
  if (doc.acceptanceDate) { doc.acceptanceDate = doc.acceptanceDate.toString(); }
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

function convertDocToObjClientContract(doc) {
  doc._id = doc._id.toString();
  doc.client = JSON.parse(JSON.stringify(doc.client));
  if (doc.contractType) {doc.contractType = JSON.parse(JSON.stringify(doc.contractType));}
  if (doc.contractItems) { doc.contractItems = JSON.parse(JSON.stringify(doc.contractItems)); }
  if (doc.subscriptionDate) { doc.subscriptionDate = doc.subscriptionDate.toString(); }
  if (doc.startDate) { doc.startDate = doc.startDate.toString(); }
  if (doc.endDate) { doc.endDate = doc.endDate.toString(); }
  if (doc.createdAt) { doc.createdAt = doc.createdAt.toString(); }
  if (doc.updatedAt) { doc.updatedAt = doc.updatedAt.toString(); }
  return doc;
}

const db = {
  connect,
  disconnect,
  convertDocToObj,
  convertDocToObjClient,
  convertDocToObjWorker,
  convertDocToObjClientProform,
  convertDocToObjClientContract
};
export default db;
