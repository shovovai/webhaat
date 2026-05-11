import type { Schema } from "mongoose";

export interface SoftDeleted { deletedAt?: Date | null; }

export const softDeletePlugin = (schema: Schema): void => {
  schema.add({ deletedAt: { type: Date, default: null, index: true } });
  const excludeDeleted = function (this: { where: (criteria: Record<string, unknown>) => void }): void { this.where({ deletedAt: null }); };
  schema.pre("find", excludeDeleted);
  schema.pre("findOne", excludeDeleted);
  schema.pre("countDocuments", excludeDeleted);
};
