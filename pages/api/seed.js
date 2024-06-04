import nc from 'next-connect';
import db from '../../utils/db';
import data from '../../utils/data';
import ClientContractClause from '../../models/ClientContractClause';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await ClientContractClause.deleteMany();
  await ClientContractClause.insertMany(data.clientContractClauses);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;
