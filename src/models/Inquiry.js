import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  sender: { type: String, enum: ['admin', 'user'], required: true },
  text: { type: String, required: true },
  senderName: { type: String, required: true },
}, { timestamps: true });

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
    email: String,
    userId: String
  },
  targetSeller: {
    type: String,
    default: "Admin Support"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isUserRead: {
    type: Boolean,
    default: true
  },
  replies: {
    type: [ReplySchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
