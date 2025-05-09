import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Ensure emails are stored in lowercase
        },
        phoneNumber: {
            type: String, // Changed from Number to String
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "recruiter"],
            required: true,
        },
        profile: {
            bio: { type: String, default: "" },
            skills: [{ type: String, default: "" }],
            resume: { type: String, default: "" }, // URL to resume file
            resumeOriginalName: { type: String, default: "" },
            company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
            profilePhoto: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 🔍 Compare hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
