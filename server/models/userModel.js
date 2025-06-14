const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@uel\.ac\.uk$/,
        "Only @uel.ac.uk email addresses are allowed",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Profile fields
    name: { type: String },
    rollNo: { type: String },
    degree: { type: String },
    bio: { type: String, default: "" },
    major: { type: String },
    avatar: { type: String },
    sustainabilityScore: { type: Number, default: 0 },

    ratingsReceived: [
      {
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        review: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
