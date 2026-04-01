import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFoodDocument extends Document {
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  category?: string;
}

const FoodSchema = new Schema<IFoodDocument>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    calories:    { type: Number, min: 0 },
    protein:     { type: Number, min: 0 },
    carbs:       { type: Number, min: 0 },
    fat:         { type: Number, min: 0 },
    servingSize: { type: String, trim: true },
    category:    { type: String, trim: true },
  },
  { timestamps: true }
);

const Food: Model<IFoodDocument> =
  mongoose.models.Food ?? mongoose.model<IFoodDocument>('Food', FoodSchema);

export default Food;
