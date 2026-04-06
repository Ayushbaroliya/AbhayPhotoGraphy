import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  embedUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
