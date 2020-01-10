import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty,
  isEqual,
  isObject,
  isFunction,
  getFieldNameForElement,
  getFieldValueForElement
} from '../../helpers/utils';
import FormContext from '../../contexts/form';

function defaultFormState(overwrites) {
  return {
    touched: {},
    errors: {},
    isSubmitting: false,
    isValidating: false,
    isLoading: false,
    submitCount: 0,
    shouldRevalidate: false,
    ...overwrites
  };
}

function mergeErrors(target = {}, source = {}) {
  return Object.keys(source).reduce((memo, key) => {
    memo[key] = `${memo[key] || ''}${source[key]}`;

    return memo;
  }, target);
}

function shouldLoadFromResource(props) {
  return props.resource && isFunction(props.resource.get);
}

function fieldContext(fields, name) {
  return fields[name] && fields[name].context && fields[name].context.props;
}

export default class FormKirin extends PureComponent {
  constructor(props) {
    super(props);
    // When form is bound to resource, initialValues comes from get method.
    const initialValues = shouldLoadFromResource(props) ? {} : (props.initialValues || {});

    this.submitForm = this.submitForm.bind(this);
    this.setSubmitting = this.setSubmitting.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setField = this.setField.bind(this);
    this.unsetField = this.unsetField.bind(this);
    this.resetFormToValues = this.resetFormToValues.bind(this);
    this.validateValues = this.validateValues.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
    this.setValues = this.setValues.bind(this);
    this.setFieldTouched = this.setFieldTouched.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.setFieldError = this.setFieldError.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.bindResource = this.bindResource.bind(this);
    this.fields = {};
    this.resource = this.bindResource(props.resource);

    this.state = {
      initialValues: initialValues,
      values: { ...initialValues },
      validateOnBlur: props.validateOnBlur,
      validateOnChange: props.validateOnChange,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0
    };

    this.formData = {
      handleBlur: this.handleBlur,
      handleChange: this.handleChange,
      setField: this.setField,
      unsetField: this.unsetField,
      setFieldError: this.setFieldError,
      setErrors: this.setErrors,
      setFieldTouched: this.setFieldTouched,
      setTouched: this.setTouched,
      setFieldValue: this.setFieldValue,
      setValues: this.setValues
    };
  }

  componentDidMount() {
    if (shouldLoadFromResource(this.props)) {
      const resource = this.resource;
      // resource.get should either return values synchronously or a promise that resolve to values
      try {
        this.setLoading(true);

        Promise.resolve(resource.get())
          .then((values) => {
            if (!isEmpty(values)) {
              this.resetFormToValues(values, this.props.validateOnMount);
            }
          });
      } catch (e) {
        console.log(e);
      }

    } else if (this.props.validateOnMount) {
      this.validateValues(this.state.values);
    }
  }

  componentDidUpdate() {
    if (this.state.shouldRevalidate) {
      this.setState({ shouldRevalidate: false });
      this.validateValues(this.state.values);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!shouldLoadFromResource(props) && props.enableReinitialize && props.initialValues && props.initialValues !== state.initialValues) {
      return defaultFormState({
        values: props.initialValues,
        initialValues: props.initialValues,
        shouldRevalidate: props.validateOnReinitialize
      });
    }

    return {};
  }

  bindResource(resource) {
    if (isObject(resource)) {
      return Object.keys(resource).reduce((memo, key) => {
        if (isFunction(resource[key])) {
          memo[key] = (...args) => {
            return resource[key](this.state.values, this.formSetters(), this.props, ...args);
          };
        }

        return memo;
      }, {});
    }

    return null;
  }

  async submitForm(event) {
    event.preventDefault && event.preventDefault();
    event.stopPropagation && event.stopPropagation();
    // If no onSubmit prop is provided, look for resource.update as onSubmit handler
    // Tip: when binding form to resource with update method, we should not provide onSubmit.
    const onSubmit = this.props.onSubmit || (this.resource && this.resource.update);

    if (this.state.isSubmitting || !onSubmit) {
      return false;
    }

    const errors = await this.validateValues(this.state.values);
    const canSumbit = this.isFormValid(errors);

    if (canSumbit) {
      this.setState({ isSubmitting: true, submitCount: this.state.submitCount + 1 });
      const args = this.props.onSubmit ? [
        this.state.values,
        this.formSetters(),
        this.props
      ] : [];

      onSubmit(...args);
    }

    return canSumbit;
  }

  formSetters(setters = {}) {
    return {
      setFieldError: this.setFieldError,
      setErrors: this.setErrors,
      setFieldValue: this.setFieldValue,
      setValues: this.setValues,
      setFieldTouched: this.setFieldTouched,
      setTouched: this.setTouched,
      setLoading: this.setLoading,
      setSubmitting: this.setSubmitting,
      ...setters
    };
  }

  resetForm(event) {
    event.preventDefault && event.preventDefault();

    this.props.onReset && this.props.onReset(this.state.values, this.formSetters(), this.props);

    this.setState(defaultFormState({
      values: this.state.initialValues,
      shouldRevalidate: this.props.validateOnReset
    }));
  }

  isFormValid(errors = {}) {
    // is valid only when all values is empty.
    return Object.keys(errors).every(key => !errors[key]);
  }

  // Imperatively reset form to newValues if passed otherwise reset form using initialValues
  // Useful when we need to reset form values programmatically without user interaction
  // For example we create a form to update book information
  // and we can implement prev and next button to load previous and next book information
  resetFormToValues(newValues, shouldRevalidate) {
    const values = newValues || this.state.initialValues;

    this.setState(defaultFormState({
      values,
      initialValues: values,
      shouldRevalidate: shouldRevalidate || this.props.validateOnReset
    }));
  }

  async validateValues(values) {
    let errors;

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

      let fieldErrors = {};

      // Form level validation
      if (hasFormLevelValidate) {
        errors = await this.props.validateForm(values, this.props);
      }

      // Field level validation
      if (hasFieldLevelValidate) {
        const fieldValidatorNames = Object.keys(fieldValidators);

        await Promise.all(
          fieldValidatorNames.map(name => fieldValidators[name](values[name], name, values, fieldContext(this.fields, name)))
        ).then((result) => {
          fieldValidatorNames.forEach((name, i) => {
            fieldErrors[name] = result[i];
          });
        });
      }
      // Merge errors
      errors = mergeErrors((isObject(errors) ? errors : {}), fieldErrors);
      this.setState({
        errors,
        touched: this.touchedForErrors(errors)
      });
    } catch (e) {
      // What should we do when validation fail ?
      console.log(e);
      errors = e;
    } finally {
      // set isValidating to false
      this.setState({ isValidating: false });
    }

    return errors;
  }

  touchedForErrors(errors) {
    return Object.keys(errors).reduce((memo, field) => {
      memo[field] = true;
      return memo;
    }, {});
  }

  getFieldValidators(fields = {}, validateObj = {}) {
    // validator from predefined form field take precedency over validator from the validate prop at the form level
    const validatorsFromField = Object.keys(fields).reduce((memo, name) => {
      if (fields[name] && fields[name].validate) {
        memo[name] = fields[name].validate;
      }

      return memo;
    }, {});

    return { ...validateObj, ...validatorsFromField };
  }

  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  setSubmitting(value) {
    this.setState({ isSubmitting: value });
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

  setValues(values, shouldValidate) {
    if (isObject(values)) {
      this.setState({ values });

      if (shouldValidate) {
        this.validateValues(values);
      }
    }
  }

  // Set field value Imperatively
  // useful for change the field value programmatically
  // For example we can implement to undo action button by keeping track values of a field
  // and imperatively set the field value when user click the undo button.
  // or we can implement custom form control
  // TODO add opiton to control validation
  setFieldValue(fieldName, fieldValue, shouldValidate = false) {
    this.updateValue(fieldName, fieldValue, shouldValidate);
  }

  setFieldTouched(fieldName, touched) {
    this.setState({ touched: { ...this.state.touched, [fieldName]: touched } });
  }

  setTouched(touched) {
    if (!isEmpty(touched)) {
      this.setState({ touched });
    }
  }

  setFieldError(fieldName, errorMessage, shouldSetTouched) {
    const newState = {
      errors: { ...this.state.errors, [fieldName]: errorMessage }
    };

    if (shouldSetTouched) {
      newState.touched = { ...this.state.touched, [fieldName]: true };
    }

    this.setState(newState);
  }

  setErrors(errors, shouldSetTouched) {
    // do not setState when errors is empty to avoid unnecessary rendering
    if (!isEmpty(errors)) {
      const newState = { errors };
      if (shouldSetTouched) {
        newState.touched = this.touchedForErrors(errors);
      }
      this.setState(newState);
    }
  }

  getFieldValidator(target, fieldName) {
    let validator = target.fields[fieldName] && target.fields[fieldName].validate;

    if (!validator) {
      validator = target.props.validate && target.props.validate[fieldName];
    }

    return validator;
  }

  async updateValue(fieldName, fieldValue, shouldValidate) {
    const values = {
      ...this.state.values,
      [fieldName]: fieldValue
    };

    this.setState({ values });

    const validateOnChange = this.state.validateOnChange;
    const fieldValidator = this.getFieldValidator(this, fieldName);
    // Call field level validation if defined
    if (shouldValidate && validateOnChange && fieldValidator) {
      try {
        const fieldErrors = await fieldValidator(values[fieldName], fieldName, values, fieldContext(this.fields, fieldName));
        this.setFieldError(fieldName, fieldErrors);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async handleChange(event, callback, ...args) {
    event.stopPropagation && event.stopPropagation();
    event.stopImmediatePropagation && event.stopImmediatePropagation();

    await this.updateValue(getFieldNameForElement(event.target), getFieldValueForElement(event.target), true);

    callback && callback(...args);
  }

  async handleBlur(event, callback, ...args) {
    event.stopPropagation && event.stopPropagation();
    event.stopImmediatePropagation && event.stopImmediatePropagation();
    const fieldName = getFieldNameForElement(event.target);
    this.setState({ touched: { ...this.state.touched, [fieldName]: true }});
    const validateOnBlur = this.state.validateOnBlur;
    const fieldValidator = this.getFieldValidator(this, fieldName);
    const fieldValue = this.state.values[fieldName];

    // Call field level validation if defined
    if (validateOnBlur && fieldValidator) {
      try {
        const fieldErrors = await fieldValidator(fieldValue, fieldName, this.state.values, fieldContext(this.fields, fieldName));
        this.setFieldError(fieldName, fieldErrors);
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
      handleSubmit: this.submitForm,
      handleReset: this.resetForm,
      values: this.state.values,
      errors: this.state.errors,
      touched: this.state.touched,
      isSubmitting: this.state.isSubmitting,
      isValidating: this.state.isValidating,
      resetForm: this.resetFormToValues,
      submitCount: this.state.submitCount,
      enableValidationProps: this.props.enableValidationProps,
      validationProps: this.props.validationProps,
      resource: this.resource,
      ...this.formData
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
        get: () => this.isFormValid(this.state.errors)
      }
    });

    return (
      <FormContext.Provider value={propsForRender}>
        {children(propsForRender)}
      </FormContext.Provider>
    );
  }
}

FormKirin.propTypes = {
  initialValues: PropTypes.object,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  validateOnReinitialize: PropTypes.bool,
  validateOnReset: PropTypes.bool,
  validateOnMount: PropTypes.bool,
  enableReinitialize: PropTypes.bool,
  enableValidationProps: PropTypes.bool,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  validateForm: PropTypes.func,
  validate: PropTypes.object,
  validationProps: PropTypes.object,
  children: PropTypes.func,
  resource: PropTypes.object
};
