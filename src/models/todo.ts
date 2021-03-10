import { BaseModel } from './base-model';
import { LooseObject } from '@typings';

export class TodoItem extends BaseModel {
  title: string;
  isDeleted: boolean;

  constructor(json: any) {
    super(json);
    if (json) {
      this.title = json.title;
      this.isDeleted = json.isDeleted;
    }
  }

  public serialize(): LooseObject {
    return {
      id: this._id,
      title: this.title,
      isDeleted: this.isDeleted,
    };
  }
}
