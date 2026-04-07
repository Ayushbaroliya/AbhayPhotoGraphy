import mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. "rahul-priya"
  title: { type: String, required: true },
  coverImage: { type: String, required: true },
  coverPublicId: { type: String }, // Cloudinary public_id for deletion
  availableEvents: [{ type: String }] // e.g. ["haldi", "mehendi", "reception"]
});

export default mongoose.models.Album || mongoose.model('Album', AlbumSchema);
