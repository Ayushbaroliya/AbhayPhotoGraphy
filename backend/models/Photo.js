import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  albumId: { type: String, required: true }, // referencing Album's id
  event: { type: String, required: true }, // e.g. "haldi", "reception"
  src: { type: String, required: true },
  publicId: { type: String }, // Cloudinary public_id for deletion
  alt: { type: String },
  order: { type: Number, default: 0 }
});

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
