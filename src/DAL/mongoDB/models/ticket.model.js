import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
  },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);

