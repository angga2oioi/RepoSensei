//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate, aggregatePaginate } from "../../utils/mongoose/plugins";

const { String, Mixed } = mongoose.Schema.Types;

const CredentialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            unique: true
        },
        secret: {
            type: Mixed,
        },
    },
    {
        timestamps: true,
    }
);

CredentialSchema.index({ createdAt: 1 });
CredentialSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
CredentialSchema.plugin(toJSON);
CredentialSchema.plugin(paginate);
CredentialSchema.plugin(aggregatePaginate);

export default mongoose.models.Credential ||
    mongoose.model("Credential", CredentialSchema);
