import mongoose from 'mongoose';

const clientContractClauseSchema = new mongoose.Schema(
    {
        clause: { type: String },
        details: { type: String },
    },
    {
        timestamps: true,
    }
);

const ClientContractClause = mongoose.models.ClientContractClause || mongoose.model('ClientContractClause', clientContractClauseSchema);
export default ClientContractClause;