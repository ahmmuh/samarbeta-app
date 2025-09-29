// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   phone: { type: Number, required: true, unique: true },
//   username: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   lastFour: {
//     type: String,
//     required: true,
//     minlength: 4,
//     maxlength: 4,
//     unique: true,
//   },

//   isDeleted: {
//     type: Boolean,
//     default: false,
//   },

//   role: {
//     type: [String],
//     enum: [
//       "Avdelningschef",
//       "Områdeschef",
//       "Enhetschef",
//       "Flyttstädansvarig",
//       "Specialare",
//       "Lokalvårdare",
//     ],
//     default: [],
//   },

//   unit: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Unit",
//   },

//   currentAddress: { type: String, default: "" },
//   currentLocation: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       default: "Point",
//     },
//     coordinates: { type: [Number] }, // [longitude, latitude]
//   },
//   allowedWorkplaces: [
//     {
//       address: { type: String },
//       location: {
//         type: { type: String, enum: ["Point"], default: "Point" },
//         coordinates: { type: [Number], required: true },
//       },
//     },
//   ],
//   keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
//   expoPushToken: String,
// });

// // Gör modellen geospatial-ready
// userSchema.index({ currentLocation: "2dsphere" });
// userSchema.index({ "allowedWorkplaces.location": "2dsphere" });
// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true, unique: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  lastFour: {
    type: String,
    required: true,
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

  workplaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkPlace" }],

  keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
  expoPushToken: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
