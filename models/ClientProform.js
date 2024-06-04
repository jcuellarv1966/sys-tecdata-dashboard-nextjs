import mongoose from 'mongoose';
import { clientSchema } from "./Client";
mongoose.model('Client', clientSchema);

const clientProformSchema = new mongoose.Schema(
    {
        numberProform: { type: String },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        razSocial: { type: String },
        observations: { type: String },
        proformItems: [
            {
                title: { type: String, required: true },
                slug: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }, 
            }
        ],
        subtotal: { type: Number },
        igv: { type: Number },
        total: { type: Number },
        issueDate: { type: Date, default: Date.now() },
        receptionDate: { type: Date, default: Date.now() },
        acceptanceDate: { type: Date, default: Date.now() },
        acceptance: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const ClientProform = mongoose.models.ClientProform || mongoose.model('ClientProform', clientProformSchema);
export default ClientProform;