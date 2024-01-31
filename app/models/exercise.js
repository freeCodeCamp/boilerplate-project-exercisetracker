const { Schema, model } = require("mongoose");

/**
 *
 * Exercise Schema
 * @constructor ExerciseSchema
 */
const ExerciseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      transform: (date) => date.toDateString(),
    },
  },
  {
    id: false,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret.user._id;
        delete ret.user;
      },
    },
  }
);

ExerciseSchema.virtual("username").get(function () {
  return this.user.username;
});

module.exports = model("Exercise", ExerciseSchema);
