import { isNumber, isString, uniq } from '../helpers/utils';

const MESSAGES = {
  required(value, fieldName) {
    return `${fieldName} is required.`;
  },
  max(value, fieldName, values, props = {}) {
    return `${fieldName} can't not be greater than ${props.max}. You enter ${value}.`;
  },
  min(value, fieldName, values, props = {}) {
    return `${fieldName} can't not be smaller than ${props.min}. You enter ${value}.`;
  },
  maxLength(value, fieldName, values, props = {}) {
    return `${fieldName} can't be longer than ${props.maxLength} characters. You enter ${value.length} characters.`;
  },
  minLength(value, fieldName, values, props = {}) {
    return `${fieldName} can't be shorter than ${props.minLength} characters. You enter ${value.length} characters.`;
  },
  pattern(value, fieldName) {
    return `${value || "''"} is not valid value for ${fieldName}.`;
  },
  isEmail(value) {
    return `${value || "''"} is not a valid email address.`;
  },
  isPhoneNumber(value) {
    return `${value || "''"} is not a valid phone number.`;
  },
  isNumber(value) {
    return `${value || "''"} is not a valid number.`;
  }
};

export const BUILTIN_VALIDATION_METHOD_NAMES = ['required', 'min', 'max', 'minLength', 'maxLength', 'pattern'];

export const VALIDATION_METHODS = {
  required(value, fieldName, values, props = {}) {
    return value ? '' : getErrorMessage('required', props.errorMessages, MESSAGES, value, fieldName, values, props);
  },

  max(value, fieldName, values, props = {}) {
    const { max, errorMessages } = props;

    if (isNumber(value) && isNumber(max)) {
      const number = Number(value);
      const maxValue = Number(max);
      return number > maxValue ? getErrorMessage('max', errorMessages, MESSAGES, value, fieldName, values, props) : '';
    }

    return '';
  },

  min(value, fieldName, values, props = {}) {
    const { min, errorMessages } = props;

    if (isNumber(value) && isNumber(min)) {
      const number = Number(value);
      const minValue = Number(min);
      return number < minValue ? getErrorMessage('min', errorMessages, MESSAGES, value, fieldName, values, props) : '';
    }

    return '';
  },

  maxLength(value, fieldName, values, props = {}) {
    const { maxLength, errorMessages } = props;

    if (isString(value) && isNumber(maxLength)) {
      const maxValue = Number(maxLength);
      return value.length > maxValue ? getErrorMessage('maxLength', errorMessages, MESSAGES, value, fieldName, values, props) : '';
    }

    return '';
  },

  minLength(value, fieldName, values, props = {}) {
    const { minLength, errorMessages } = props;

    if (isString(value) && isNumber(minLength)) {
      const minValue = Number(minLength);
      return value.length < minValue ? getErrorMessage('minLength', errorMessages, MESSAGES, value, fieldName, values, props) : '';
    }

    return '';
  },

  pattern(value, fieldName, values, props = {}, errorName) {
    const { pattern, errorMessages } = props;

    if (isString(pattern) && isString(value)) {
      return new RegExp(pattern).test(value) ? '' : getErrorMessage(errorName || 'pattern', errorMessages, MESSAGES, value, fieldName, values, props);
    }

    return '';
  },

  isEmail(value, fieldName, values, props = {}) {
    const { isEmail } = props;

    return VALIDATION_METHODS.pattern(
      value,
      fieldName,
      values,
      { ...props, pattern: isString(isEmail) ? isEmail : '^.+@.+\..+$' },
      'isEmail'
    );
  },

  isPhoneNumber(value, fieldName, values, props = {}) {
    const { isPhoneNumber } = props;

    return VALIDATION_METHODS.pattern(
      value,
      fieldName,
      values,
      { ...props, pattern: isString(isPhoneNumber) ? isPhoneNumber : '^[0-9]{3}-[0-9]{3}-[0-9]{4}$' },
      'isPhoneNumber'
    );
  },

  isNumber(value, fieldName, values, props = {}) {
    const { isNumber } = props;

    return VALIDATION_METHODS.pattern(
      value,
      fieldName,
      values,
      { ...props, pattern: isString(isNumber) ? isNumber : '^-?\d*(\.\d+)?$' },
      'isNumber'
    );
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

export function getErrorMessage(key, userDefinedMsg = {}, defaultMsg = {}, ...args) {
  let message = userDefinedMsg[key] || defaultMsg[key];

  if (typeof message === 'function') {
    message = message(...args);
  } else if (!isString(message)){
    message = '';
  }

  return message;
}

export default class Validator {
  constructor() {
    this.validators = [];
  }

  validate(value, fieldName, values, props) {
    return Promise.all(this.validators.map(validator => validator(value, fieldName, values, props)))
      .then((messages) => messages.filter(m => !!m).join(' '))
      .catch(() => '');
  }

  addValidateMethod(method, formLevelValidators = {}) {
    const validatorMethod = formLevelValidators[method] || VALIDATION_METHODS[method];
    validatorMethod && this.validators.push(validatorMethod);
  }
}
