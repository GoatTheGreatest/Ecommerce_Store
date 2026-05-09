import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'Pcs'
  },
  customer: {
    name: String,
    email: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
