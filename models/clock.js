import mongoose from "mongoose";

const clockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clockInDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    clockOutDate: {
      type: Date,
      default: null,
    },
    totalMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuellt fält för duration
clockSchema.virtual("duration").get(function () {
  if (this.clockInDate && this.clockOutDate) {
    return Math.round((this.clockOutDate - this.clockInDate) / 1000 / 60);
  }
  return null;
});

// Räkna ut totalMinutes automatiskt
clockSchema.pre("save", function (next) {
  if (this.clockInDate && this.clockOutDate) {
    this.totalMinutes = Math.round(
      (this.clockOutDate - this.clockInDate) / 1000 / 60
    );
  }
  next();
});

export default mongoose.model("Clock", clockSchema);
