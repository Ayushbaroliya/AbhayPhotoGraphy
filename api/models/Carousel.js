import mongoose from 'mongoose';

const CarouselSchema = new mongoose.Schema({
  src: { type: String, required: true },
  tab: { type: String, required: true },
  order: { type: Number, default: 0 }
});

export default mongoose.models.Carousel || mongoose.model('Carousel', CarouselSchema);
