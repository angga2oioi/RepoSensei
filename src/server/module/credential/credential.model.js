//@ts-check
import { USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";
import mongoose from "../../utils/mongoose";
import { toJSON, paginate, aggregatePaginate } from "../../utils/mongoose/plugins";

const { String, Mixed } = mongoose.Schema.Types;

const CredentialSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
            index: true,
            enum: {
                values: [
                    USERNAME_PASSWORD_CREDENTIAL_TYPE
                ],
                message: "{VALUE} is not supported",
            },
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
            maxLength:32
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            maxLength:64
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
