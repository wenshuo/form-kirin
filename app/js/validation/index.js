import { uniq } from '../helpers/utils';
import Validator, { VALIDATION_METHODS } from './validator';

export function getValidator(props, formLevelValidators = {}) {
  let validator;
  // Get list of validators for the corresponding props
  const validators = uniq([
    ...Object.keys(formLevelValidators),
    ...Object.keys(VALIDATION_METHODS)
  ]).filter(v => props[v] !== undefined);

  if (validators.length) {
    validator = new Validator();
    validators.forEach(v => validator.addValidateMethod(v, props[v], formLevelValidators));
  }

  return validator;
}
