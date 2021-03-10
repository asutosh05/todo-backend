import lodash from 'lodash';
import { BaseController } from './base-controller';
import { NextFunction, response, Response, Router } from 'express';
import { Validation } from '@helpers';
import { TodoItem } from '@models';
import { AppContext, Errors, ExtendedRequest, ValidationFailure } from '@typings';
import { createTodoValidator, deleteTodoValidator } from '@validators';

export class TodoController extends BaseController {
  public basePath: string = '/todos';
  public router: Router = Router();

  constructor(ctx: AppContext) {
    super(ctx);
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.basePath}`,
      createTodoValidator(this.appContext),
      this.createTodoItem,
    );

    this.router.delete(
      `${this.basePath}/:id`,
      deleteTodoValidator(this.appContext),
      this.deleteTodoItem,
    );
  }

  private createTodoItem = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const failures: ValidationFailure[] = Validation.extractValidationErrors(
      req,
    );
    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('VALIDATION_ERRORS.INVALID_TITLE'),
        failures,
     );
      return next(valError);
    }

    const { title } = req.body;
    const todo = await this.appContext.todoRepository.save(
      new TodoItem({
        title,
      }),
    );
    res.status(201).json(todo.serialize());
  }

  private deleteTodoItem = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const failures: ValidationFailure[] = Validation.extractValidationErrors(
      req,
    );

    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('VALIDATION_ERRORS.INVALID_ID'),
        failures,
      );
      return next(valError);
    }
    const { id } = req.params;
    const todo = await this.appContext.todoRepository.update(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
    );
    if (todo._id) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  }
}
