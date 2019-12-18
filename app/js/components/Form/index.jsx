import React, { PureComponent, createContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {
  isObject,
  isFunction,
  getFieldNameForElement,
  getFieldValueForElement
} from '../../helpers/utils';
import FormContext from '../../contexts/form';

const identity = v => v;

export default class Form extends PureComponent {
  constructor(props) {
    super(props);

    if (!isObject(props.initialValues)) {
      throw new Error('initialValues must be object');
    }

    this.submitForm = this.submitForm.bind(this);
    this.setSubmitting = this.setSubmitting.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setField = this.setField.bind(this);
    this.unsetField = this.unsetField.bind(this);
    this.resetFormToValues = this.resetFormToValues.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
    this.fields = {};

    this.state = {
      initialValues: props.initialValues,
      values: { ...props.initialValues },
      validateOnBlur: props.validateOnBlur,
      validateOnChange: props.validateOnChange,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false
    };

    this.formData = {
      setErrors: this.setErrors,
      handleBlur: this.handleBlur,
      handleChange: this.handleChange,
      setField: this.setField,
      unsetField: this.unsetField
    };

    Object.defineProperties(this.formData, {
      values: {
        enumerable: false,
        configurable: false,
        get: () => this.state.values
      },
      errors: {
        enumerable: false,
        configurable: false,
        get: () => this.state.errors
      },
      touched: {
        enumerable: false,
        configurable: false,
        get: () => this.state.touched
      },
    });
  }

  async submitForm(event) {
    event.preventDefault();
    event.stopPropagation();

    // can't submit form during submission
    if (this.state.isSubmitting || !this.props.onSubmit) {
      return false;
    }

    let canSubmit = true;
    const values = this.state.values;

    // Perform form level validation if there's validate function prop
    try {
      const hasFormLevelValidate = (typeof this.props.validateForm === 'function');
      const fieldValidators = this.getFieldValidators(this.fields, this.props.validate);
      const hasFieldLevelValidate = !isEmpty(fieldValidators);

      if (hasFormLevelValidate || hasFieldLevelValidate) {
        this.setState({
          isValidating: true
        });
      }

      let errors = {};
      let fieldErrors = {};

      // Form level validation
      if (hasFormLevelValidate) {
        errors = await this.props.validateForm(this.state.values, this.props);
      }

      // Field level validation
      if (hasFieldLevelValidate) {
        const fieldValidatorNames = Object.keys(fieldValidators);

        await Promise.all(
          fieldValidatorNames.map(name => fieldValidators[name](values[name], name, values))
        ).then((result) => {
          fieldValidatorNames.forEach((name, i) => {
            fieldErrors[name] = result[i];
          });
        });
      }
      errors = { ...errors, ...fieldErrors };
      this.setState({
        errors,
        touched: Object.keys(errors).reduce((memo, field) => {
          memo[field] = true;
          return memo;
        }, {})
      });
      canSubmit = this.hasErrors(errors);
    } catch (e) {
      // What should we do when validation fail ?
      canSubmit = false;
      console.log(e);
    } finally {
      // set isValidating to false
      this.setState({ isValidating: false });
    }

    if (canSubmit) {
      this.setState({ isSubmitting: true });
      this.props.onSubmit(this.state.values, this.setSubmitting);
    }
  }

  resetForm(event) {
    this.setState(this.defaultFormState());

    this.props.onReset?.(event);
  }

  defaultFormState(overwrites) {
    return {
      values: this.state.initialValues,
      touched: {},
      errors: {},
      isSubmitting: false,
      isValidating: false,
      ...overwrites
    };
  }

  hasErrors(errors = {}) {
    return Object.keys(errors).every(key => !errors[key]);
  }

  // Imperatively reset form to newValues if passed otherwise reset form using initialValues
  // Useful when we need to reset form values programmatically without user interaction
  // For example we create a form to update book information
  // and we can implement prev and next button to load previous and next book information
  resetFormToValues(newValues) {
    const values = newValues || this.state.initialValues;

    this.setState({
      ...this.defaultFormState({ values }),
      initialValues: values
    });
  }

  getFieldValidators(fields = {}, validateObj = {}) {
    // validator from predefined form field take precedency over validator from the validate prop at the form level
    const validatorsFromField = Object.keys(fields).reduce((memo, name) => {
      if (fields?.[name]?.validate) {
        memo[name] = fields[name].validate;
      }

      return memo;
    }, {});

    return { ...validateObj, ...validatorsFromField };
  }

  setSubmitting(value) {
    this.setState({ isSubmitting: value });
  }

  setErrors(errors) {
    // do not setState when errors is empty to avoid unnecessary rendering
    if (!isEmpty(errors)) {
      this.setState({ errors: { ...this.state.errors, ...errors } });
    }
  }

  setField(field) {
    const fieldName = field.name;

    this.fields[fieldName] = {
      ...this.fields[fieldName],
      ...field
    };
  }

  unsetField(fieldName) {
    // remove field related state when a field is unmounted
    // typically important for conditional fields which only render depend on the value of other fields.
    delete this.fields[fieldName];
    delete this.state.values[fieldName];
    delete this.state.errors[fieldName];
    delete this.state.touched[fieldName];
  }

  // Set field value Imperatively
  // useful for change the field value programmatically
  // For example we can implement to undo action button by keeping track values of a field
  // and imperatively set the field value when user click the undo button.
  // or we can implement custom form control
  setFieldValue(fieldName, fieldValue) {
    this.handleChange(fieldName, fieldValue);
  }

  async handleChange(event, callback, ...args) {
    event.stopPropagation?.();
    event.stopImmediatePropagation?.();

    const fieldName = getFieldNameForElement(event.target);
    const fieldValue = getFieldValueForElement(event.target);
    const values = {
      ...this.state.values,
      [fieldName]: fieldValue
    };

    this.setState({ values });

    const validateOnChange = this.state.validateOnChange;
    const fieldValidator = this.fields?.[fieldName]?.validate;
    // Call field level validation if defined
    if (validateOnChange && fieldValidator) {
      try {
        const fieldErrors = await fieldValidator(values[fieldName], fieldName, values);
        this.setErrors({ [fieldName]: fieldErrors });
      } catch (e) {
        console.log(e);
      }
    }

    callback && callback(...args);
  }

  async handleBlur(event, callback, ...args) {
    event.stopPropagation?.();
    event.stopImmediatePropagation?.();
    const fieldName = getFieldNameForElement(event.target);

    this.setState({ touched: { ...this.state.touched, [fieldName]: true }});
    const validateOnBlur = this.state.validateOnBlur;
    const fieldValidator = this.fields?.[fieldName]?.validate;
    const fieldValue = this.state.values[fieldName];

    // Call field level validation if defined
    if (validateOnBlur && fieldValidator) {
      try {
        const fieldErrors = await fieldValidator(fieldValue, fieldName, this.state.values);
        this.setErrors({ [fieldName]: fieldErrors });
      } catch (e) {
        console.log(e);
      }
    }

    callback && callback(...args);
  }

  render() {
    const children = this.props.children;

    if (typeof children !== 'function') {
      throw new Error('Children of form must be a function.');
    }

    const propsForRender = {
      handleChange: this.handleChange,
      handleBlur: this.handleBlur,
      handleSubmit: this.submitForm,
      handleReset: this.resetForm,
      values: this.state.values,
      errors: this.state.errors,
      touched: this.state.touched,
      isSubmitting: this.state.isSubmitting,
      isValidating: this.state.isValidating,
      resetForm: this.resetFormToValues,
      setFieldValue: this.setFieldValue
    };

    // Define dirty and isValid as read only getter
    Object.defineProperties(propsForRender, {
      dirty: {
        enumerable: false,
        configurable: false,
        get: () => !isEqual(this.state.initialValues, this.state.values)
      },
      isValid: {
        enumerable: false,
        configurable: false,
        get: () => this.hasErrors(this.state.errors)
      }
    });

    return (
      <FormContext.Provider value={this.formData}>
        {children(propsForRender)}
      </FormContext.Provider>
    );
  }
}
