import mongoose from 'mongoose';

const PricingSchema = new mongoose.Schema({
  tag: { type: String, required: true }, // e.g. "Essential", "Most Popular"
  name: { type: String, required: true }, // e.g. "Silver", "Gold"
  price: { type: String, required: true }, // e.g. "₹45,000"
  per: { type: String, required: true }, // e.g. "one occasion"
  features: [{ type: String }],
  buttonText: { type: String, required: true },
  featured: { type: Boolean, default: false }
});

export default mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);
