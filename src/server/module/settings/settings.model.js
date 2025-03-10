//@ts-check
import { AI_CREDENTIAL_SETTINGS, AI_MODEL_SETTINGS, AI_PROMPT_SETTINGS, EMAIL_CREDENTIAL_SETTINGS } from "@/global/utils/constant";
import mongoose from "../../utils/mongoose";
import { toJSON, paginate, aggregatePaginate } from "../../utils/mongoose/plugins";

const { String, Mixed } = mongoose.Schema.Types;

const SettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            enum: {
                values: [
                    AI_MODEL_SETTINGS,
                    AI_PROMPT_SETTINGS,
                    AI_CREDENTIAL_SETTINGS,
                    EMAIL_CREDENTIAL_SETTINGS,
                ],
                message: "{VALUE} is not supported",
            },
            index: true,
        },
        value: {
            type: Mixed,
        },
    },
    {
        timestamps: true,
    }
);

SettingsSchema.index({ createdAt: 1 });
SettingsSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
SettingsSchema.plugin(toJSON);
SettingsSchema.plugin(paginate);
SettingsSchema.plugin(aggregatePaginate);

export default mongoose.models.Settings ||
    mongoose.model("Settings", SettingsSchema);
