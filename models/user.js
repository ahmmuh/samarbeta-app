import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true, unique: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  LastFour: {
    type: String,
    required: true,
    length: 4, //de 4 sista siffror på persnonummer
    unique: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

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

  currentAddress: { type: String, default: "" },
  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: { type: [Number], default: undefined }, // [longitude, latitude]
  },
  allowedWorkplaces: [
    {
      address: { type: String },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },
  ],
  keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
  expoPushToken: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
