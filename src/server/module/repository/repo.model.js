//@ts-check
import { BITBUCKET_REPO_TYPE } from "@/global/utils/constant";
import mongoose from "../../utils/mongoose";
import { toJSON, paginate, aggregatePaginate } from "../../utils/mongoose/plugins";

const { String, Mixed, ObjectId } = mongoose.Schema.Types;

const RepositorySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
            index: true,
            enum: {
                values: [
                    BITBUCKET_REPO_TYPE
                ],
                message: "{VALUE} is not supported",
            },
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
            maxLength: 64
        },
        connection: {
            type: Mixed,
            index: true,
        },
        secret: {
            type: ObjectId,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

RepositorySchema.index({ createdAt: 1 });
RepositorySchema.index({ updatedAt: 1 });
RepositorySchema.index({ "connection.workspace": 1 })
RepositorySchema.index({ "connection.repo_slug": 1 })

// add plugin that converts mongoose to json
RepositorySchema.plugin(toJSON);
RepositorySchema.plugin(paginate);
RepositorySchema.plugin(aggregatePaginate);

export default mongoose.models.Repository ||
    mongoose.model("Repository", RepositorySchema);
