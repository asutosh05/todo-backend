import { model, Schema } from 'mongoose';

const todoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    collection: 'todos',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
const todo = model('Todo', todoSchema);
export default todo;
