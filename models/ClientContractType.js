import mongoose from 'mongoose';

const clientContractTypeSchema = new mongoose.Schema(
    {
        name: { type: String }
    },
    {
        timestamps: true,
    }
);

const ClientContractType = mongoose.models.ClientContractType || mongoose.model('ClientContractType', clientContractTypeSchema);
export default ClientContractType;