import mongoose from 'mongoose';

const ClientProformDetailSchema = new mongoose.Schema(
    {
        numberProform: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientProform', required: false },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
        quantity: { type: Number },
        price: { type: Number },
        subtotal: { type: Number },
    },
    {
        timestamps: true,
    }
);

const ClientProformDetail = mongoose.models.ClientProformDetail || mongoose.model('ClientProformDetail', ClientProformDetailSchema);
export default ClientProformDetail;