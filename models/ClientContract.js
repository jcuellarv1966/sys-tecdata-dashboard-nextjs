import mongoose from 'mongoose';
import { clientContractTypeSchema } from "./ClientContractType";
mongoose.model('ClientContractType', clientContractTypeSchema);
import { clientSchema } from "./Client";
mongoose.model('Client', clientSchema);
import { clientContractClauseSchema } from "./ClientContractClause";
mongoose.model('ClientContractClause', clientContractClauseSchema);

const clientContractSchema = new mongoose.Schema(
    {
        numberContract: { type: String },
        contractType: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientContractType', required: false },
        numberOrder: { type: String },
        numberProject: { type: String },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        razSocial: { type: String },
        observations: { type: String },
        contractItems: [
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
        charges: { type: Number },
        balanceOutstanding: { type: Number },
        contractClauses: [
            {
                clause: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientContractClause', required: false },
                observation: { type: String },
            }
        ],
        subscriptionDate: { type: Date, default: Date.now() },
        startDate: { type: Date, default: Date.now() },
        endDate: { type: Date, default: Date.now() },
        cash_credit: { type: Boolean },
        isValid: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

const ClientContract = mongoose.models.ClientContract || mongoose.model('ClientContract', clientContractSchema);
export default ClientContract;