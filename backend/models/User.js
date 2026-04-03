import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    address: String,
    skills: [String],
    profileImage: { type: String, default: "profile.jpg" },

    role: {
        type: String,
        enum: ["user", "worker"],
        default: "user",
    },
    ratings: [{
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
    }],

    // After the existing ratings array, add:
employerRatings: [{
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
}],
averageEmployerRating: { type: Number, default: 0 },
totalEmployerRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

// ================= REFERRALS =================
userSchema.add({
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Referral" }],
});

export default mongoose.model("User", userSchema);