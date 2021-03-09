import { model, Schema } from 'mongoose';

const todoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isCompleted:{
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted:{
      type:Boolean,
      required:true,
      default:false,
    },
    completedAt:{
      type: Date,
      default:null,
    },
    deletedAt:{
      type:Boolean,
      default:null,
    },
  }  ,
  {
    collection:'todo',
    timestamps:{
      createdAt:'createdAt',
      updatedAt:'updatedAt',
    },
  },
);
const todo = model('Todo', todoSchema);
export default todo;
