// import mongoose from "mongoose";
// const taskSchema = new mongoose.Schema(
//   {
//     title: String,
//     description: String,
//     location: String, // adress
//     coordinates: {
//       type: [Number], // [lon, lat]
//       default: null,
//     },
//     status: {
//       type: String,
//       enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],
//       default: "Ej påbörjat",
//     },
//     unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const Task = mongoose.model("Task", taskSchema);

// export default Task;

// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: String,
//     address: String, // sparar textadressen separat

//     // GeoJSON location — nödvändig för MongoDB:s geospatial queries
//     location: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         required: true,
//       },
//     },

//     status: {
//       type: String,
//       enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],
//       default: "Ej påbörjat",
//     },

//     unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", default: null },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// // 📍 Skapa geospatial index för $near, $geoWithin etc.
// taskSchema.index({ location: "2dsphere" });

// const Task = mongoose.model("Task", taskSchema);
// export default Task;

//Senast kod

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String }, // valfritt
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [lon, lat]
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },

    status: {
      type: String,
      enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],
      default: "Ej påbörjat",
    },
  },
  { timestamps: true }
);

taskSchema.index({ location: "2dsphere" }); // viktigt för geospatiala queries

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
