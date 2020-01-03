import { isNumber, isString } from '../helpers/utils';
import template from 'lodash/template';
import uniq from 'lodash/uniq';

const MESSAGES = {
  required({ fieldName }) {
    return `${fieldName} is required.`;
  },
  max({ max, value, fieldName }) {
    return `${fieldName} can't not be greater than ${max}. You enter ${value}.`;
  },
  min({ min, value, fieldName }) {
    return `${fieldName} can't not be smaller than ${min}. You enter ${value}.`;
  },
  maxLength({ maxLength, value, fieldName }) {
    return `${fieldName} can't be longer than ${maxLength} characters. You enter ${value.length} characters.`;
  },
  minLength({ minLength, value, fieldName }) {
    return `${fieldName} can't be shorter than ${minLength} characters. You enter ${value.length} characters.`;
  },
  pattern({ value, fieldName }) {
    return `${value || "''"} is not valid value for ${fieldName}.`;
  }
};

export const BUILTIN_VALIDATION_METHOD_NAMES = ['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'];

export const VALIDATION_METHODS = {
  required({ errorMessages, value, fieldName }) {
    return value ? '' : getErrorMessage('required', errorMessages, MESSAGES, { value, fieldName });
  },

  max({ max, errorMessages, value, fieldName }) {
    if (isNumber(value) && isNumber(max)) {
      const number = Number(value);
      const maxValue = Number(max);
      return number > maxValue ? getErrorMessage('max', errorMessages, MESSAGES, { value, fieldName, max: maxValue }) : '';
    }

    return '';
  },

  min({ min, errorMessages, value, fieldName }) {
    if (isNumber(value) && isNumber(min)) {
      const number = Number(value);
      const minValue = Number(min);
      return number < minValue ? getErrorMessage('min', errorMessages, MESSAGES, { value, fieldName, min: minValue }) : '';
    }

    return '';
  },

  maxLength({ maxLength, errorMessages, value, fieldName }) {
    if (isString(value) && isNumber(maxLength)) {
      const maxValue = Number(maxLength);
      return value.length > maxValue ? getErrorMessage('maxLength', errorMessages, MESSAGES, { value, fieldName, maxLength: maxValue }) : '';
    }

    return '';
  },

  minLength({ minLength, errorMessages, value, fieldName }) {
    if (isString(value) && isNumber(minLength)) {
      const minValue = Number(minLength);
      return value.length < minValue ? getErrorMessage('minLength', errorMessages, MESSAGES, { value, fieldName, minLength: minValue }) : '';
    }

    return '';
  },

  pattern({ pattern, errorMessages, value, fieldName }) {
    if (isString(pattern) && isString(value)) {
      return new RegExp(pattern).test(value) ? '' : getErrorMessage('pattern', errorMessages, MESSAGES, { value, fieldName, pattern });
    }

    return '';
  }
};

export function addValidations(validations = {}) {
  Object.assign(VALIDATION_METHODS, validations);
}

export function nonNativeProps(formLevelValidators = {}) {
  return uniq([
    ...Object.keys(formLevelValidators),
    ...Object.keys(VALIDATION_METHODS)
  ]).filter(v => !BUILTIN_VALIDATION_METHOD_NAMES.includes(v));
}

export function getErrorMessage(key, userDefinedMsg = {}, defaultMsg = {}, context = {}) {
  let message = userDefinedMsg[key] || defaultMsg[key];

  if (isString(message)) {
    message = template(message)(context);
  } else if (typeof message === 'function') {
    message = message(context);
  } else {
    message = '';
  }

  return message;
}

export default class Validator {
  constructor() {
    this.validators = [];
  }

  validate(errorMessages, value, fieldName, values) {
    // TODO make it work with async validations
    return this.validators
      .map(({ fn, args }) => fn({ value, fieldName, values, errorMessages, ...args }))
      .filter(error => !!error).join(' ');
  }

  addValidateMethod(method, args, formLevelValidators = {}) {
    const validatorMethod = formLevelValidators[method] || VALIDATION_METHODS[method];

    if (validatorMethod) {
      this.validators.push({
        fn: validatorMethod,
        args: {
          [method]: args
        }
      });
    }
  }
}
