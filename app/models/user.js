const { Schema, model } = require("mongoose");

/**
 *
 * User Schema
 * @constructor UserSchema
 */
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    id: false,
    toJSON: { versionKey: false, virtuals: true },
  }
);

UserSchema.virtual("exercises", {
  ref: "Exercise",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

module.exports = model("User", UserSchema);
