import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  profileImage: { type: String },
  profilePublicId: { type: String },
  socials: {
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    whatsapp: { type: String }
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.About || mongoose.model('About', AboutSchema);
