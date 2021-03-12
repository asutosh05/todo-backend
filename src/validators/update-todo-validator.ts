import lodash from 'lodash';
import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';

const updateTodoValidator = (appContext: AppContext): ValidationChain[] => [
  check('title', 'VALIDATION_ERRORS.INVALID_TITLE').notEmpty().isString(),
  check('id', 'VALIDATION_ERRORS.INVALID_ID').notEmpty().isString(),
];

export default updateTodoValidator;
