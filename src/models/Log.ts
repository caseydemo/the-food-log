import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ILogDocument extends Document {
  food: Types.ObjectId;
  quantity: number;
  unit?: string;
  notes?: string;
  loggedAt: Date;
}

const LogSchema = new Schema<ILogDocument>(
  {
    food:     { type: Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit:     { type: String, trim: true },
    notes:    { type: String, trim: true },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Log: Model<ILogDocument> =
  mongoose.models.Log ?? mongoose.model<ILogDocument>('Log', LogSchema);

export default Log;
