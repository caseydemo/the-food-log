import type { IFood } from './food';

export interface ILog {
  _id: string;
  food: string | IFood;
  quantity: number;
  unit?: string;
  notes?: string;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateLogInput = {
  food: string;
  quantity: number;
  unit?: string;
  notes?: string;
  loggedAt?: string;
};

export type UpdateLogInput = Partial<CreateLogInput>;
