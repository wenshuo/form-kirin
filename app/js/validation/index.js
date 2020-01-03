import uniq from 'lodash/uniq';
import Validator, { VALIDATION_METHODS } from './validator';
import { isNumber } from '../helpers/utils';

const PATTERNS = {
  email: '^.+@.+\..+$'
};

export function getValidator(props, formLevelValidators = {}) {
  let validator;
  const pattern = props.pattern || PATTERNS[props.type];
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
