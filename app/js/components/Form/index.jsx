import React, { PureComponent, createContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { isObject, getFieldNameForElement } from '../../helpers/utils';
import FormContext from '../../contexts/form';

export default class Form extends PureComponent {
  constructor(props) {
    super(props);

    if (!isObject(props.initialValues)) {
      throw new Error('initialValues must be object');
    }

    this.validate = props.validate;
    this.handleSubmit = props.handleSubmit;
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
      isValidating: false,
      setErrors: this.setErrors,
      handleBlur: this.handleBlur,
      handleChange: this.handleChange,
      setField: this.setField,
      unsetField: this.unsetField
    };

    // define dirty as read only get property
    Object.defineProperty(this.state, 'dirty', {
      enumerable: false,
      configurable: false,
      get() {
        return !isEqual(this.initialValues, this.values);
      }
    });

    // define isValid as read only get property
    Object.defineProperty(this.state, 'isValid', {
      enumerable: false,
      configurable: false,
      get() {
        return isEmpty(this.errors)
      }
    });
  }

  async submitForm(event) {
    event.preventDefault();
    event.stopPropagation();

    // can't submit form during submission
    if (this.state.isSubmitting || !this.handleSubmit) {
      return false;
    }

    let canSubmit = true;
    const values = this.state.values;

    // Perform form level validation if there's validate function prop
      try {
        const hasFormLevelValidate = (typeof this.validate === 'function');
        const fieldValidators = this.getFieldValidators(this.fields);
        const hasFieldLevelValidate = !isEmpty(fieldValidators);

        if (hasFormLevelValidate || hasFieldLevelValidate) {
          this.setState({
            isValidating: true,
            touched: Object.keys(this.fields).reduce((memo, field) => {
              memo[field] = true;
              return memo;
            }, {})
          });
        }

        let errors = {};
        let fieldErrors = {};

        // Form level validation
        if (hasFormLevelValidate) {
          errors = await this.validate(this.state.values, this.props);
        }

        // Field level validation
        if (hasFieldLevelValidate) {
          const fieldValidatorNames = Object.keys(fieldValidators);

          await Promise.all(
            fieldValidatorNames.map(name => fieldValidators[name](values[name], values))
          ).then((result) => {
            fieldValidatorNames.forEach((name, i) => {
              fieldErrors[name] = result[i];
            });
          });
        }

        errors = { ...errors, ...fieldErrors };
        this.setState({ errors });
        canSubmit = isEmpty(errors);
      } catch (e) {
        canSubmit = false;
        console.log(e);
      } finally {
        // set isValidating to false
        this.setState({ isValidating: false });
      }

    if (canSubmit) {
      this.setState({ isSubmitting: true });
      this.handleSubmit(this.state.values, this.setSubmitting);
    }
  }

  resetForm() {
    this.setState(this.defaultFormState());
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

  getFieldValidators(fields) {
    return Object.keys(fields).reduce((memo, name) => {
      if (fields?.[name]?.validate) {
        memo[name] = fields[name].validate;
      }

      return memo;
    }, {});
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
  setFieldValue(fieldName, fieldValue) {
    this.handleChange(fieldName, fieldValue);
  }

  async handleChange(fieldName, fieldValue, callback, ...args) {
    const values = {
      ...this.state.values,
      [fieldName]: fieldValue
    };

    this.setState({ values });

    const validateOnChange = this.state.validateOnChange;
    const fieldValidator = this.fields[fieldName].validate;
    // Call field level validation if defined
    if (validateOnChange && fieldValidator) {
      try {
        const fieldErrors = await fieldValidator(fieldValue, values);
        this.setErrors({ [fieldName]: fieldErrors });
      } catch (e) {
        console.log(e);
      }
    }

    callback && callback(...args);
  }

  async handleBlur(fieldName, callback, ...args) {
    this.setState({ touched: { ...this.state.touched, [fieldName]: true }});

    const validateOnBlur = this.state.validateOnBlur;
    const fieldValidator = this.fields[fieldName].validate;
    // Call field level validation if defined
    if (validateOnBlur && fieldValidator) {
      try {
        const fieldErrors = await fieldValidator(fieldValue, values);
        this.setErrors({ [fieldName]: fieldErrors });
      } catch (e) {
        console.log(e);
      }
    }

    callback && callback(...args);
  }

  render() {
    const { children } = this.props;
    // render prop
    if (typeof children !== 'function') {
      throw new Error('chilren of Form component must be a function.');
    }

    return (
      <FormContext.Provider value={this.state}>
        {
          children({
            handleChange: this.handleChange,
            values: this.state.values,
            errors: this.state.errors,
            touched: this.state.touched,
            handleSubmit: this.submitForm,
            isSubmitting: this.state.isSubmitting,
            isValidating: this.state.isValidating,
            isValid: this.state.isValid,
            dirty: this.state.dirty,
            resetForm: this.resetForm,
            resetFormToValues: this.resetFormToValues,
            setFieldValue: this.setFieldValue
          })
        }
      </FormContext.Provider>
    );
  }
}
