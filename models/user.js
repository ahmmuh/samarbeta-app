import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: Number, required: true, unique: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // används för stämpla in/ut
    lastFour: {
      type: String,
      minlength: 4,
      maxlength: 4,
      unique: true,
    },

    isDeleted: { type: Boolean, default: false },

    role: {
      type: [String],
      enum: [
        "Avdelningschef",
        "Områdeschef",
        "Enhetschef",
        "Flyttstädansvarig",
        "Specialare",
        "Lokalvårdare",
      ],
      default: [],
    },

    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },

    keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],

    expoPushToken: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual för att hämta alla workplaces där användaren är cleaner
userSchema.virtual("assignedWorkplaces", {
  ref: "WorkPlace",
  localField: "_id",
  foreignField: "cleaners",
});

userSchema.virtual("clocks", {
  ref: "Clock",
  localField: "_id",
  foreignField: "user", // viktigt!
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
