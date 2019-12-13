import React, { PureComponent, createContext } from 'react';
import isEmpty from 'lodash/isEmpty';

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
      isValid: true,
      setErrors: this.setErrors,
      handleBlur: this.handleBlur,
      handleChange: this.handleChange,
      setField: this.setField,
      unsetField: this.unsetField
    };
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
    this.setState({
      values: this.props.initialValues,
      touched: {},
      errors: {},
      isValid: true,
      isSubmitting: false,
      isValidating: false
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
    delete this.fields[fieldName];
  }

  handleChange(fieldName, fieldValue) {
    this.setState({
      values: {
        ...this.state.values,
        [fieldName]: fieldValue
      }
    });
  }

  handleBlur(fieldName) {
    this.setState({ touched: { ...this.state.touched, [fieldName]: true }});
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
            isValid: isEmpty(this.state.errors),
            resetForm: this.resetForm
          })
        }
      </FormContext.Provider>
    );
  }
}
