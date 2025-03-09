//@ts-check
import { MANAGE_ACCOUNT_ROLES, MANAGE_CREDENTIALS_ROLES, MANAGE_REPOSITORIES_ROLES, MANAGE_SETTINGS_ROLES } from "@/global/utils/constant";
import mongoose from "../../utils/mongoose";
import { toJSON, paginate, aggregatePaginate } from "../../utils/mongoose/plugins";

const { String } = mongoose.Schema.Types;

const AccountSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            maxLength:32
        },
        password: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        roles: {
            type: [String],
            enum: {
                values: [
                    MANAGE_ACCOUNT_ROLES,
                    MANAGE_REPOSITORIES_ROLES,
                    MANAGE_CREDENTIALS_ROLES,
                    MANAGE_SETTINGS_ROLES
                ],
                message: "{VALUE} is not supported",
            },
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

AccountSchema.index({ createdAt: 1 });
AccountSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
AccountSchema.plugin(toJSON);
AccountSchema.plugin(paginate);
AccountSchema.plugin(aggregatePaginate);

export default mongoose.models.Account ||
    mongoose.model("Account", AccountSchema);
