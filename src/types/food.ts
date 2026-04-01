export interface IFood {
  _id: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateFoodInput = Omit<IFood, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateFoodInput = Partial<CreateFoodInput>;
