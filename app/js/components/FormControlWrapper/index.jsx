// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormContext from '../../contexts/form';
import { getFieldName } from '../../helpers/utils';
import { getValidator } from '../../validation';

export default class FormControlWrapper extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    if (this.context) {
      const fieldName = getFieldName(this.props);
      const enableValidationProps = this.context.enableValidationProps;
      this.validator = getValidator(this.props, this.context.validationProps);

      this.context.setField({
        validate: (enableValidationProps && this.validator) || this.props.validate ? this.validate : null,
        name: fieldName
      });
    }
  }

  componentWillUnmount() {
    if (this.context) {
      this.context.unsetField(getFieldName(this.props));
    }
  }

  handleChange(event) {
    this.context.handleChange(event, this.props.onChange, event);
  }

  handleBlur(event) {
    this.context.handleBlur(event, this.props.onBlur, event);
  }

  async validate(...args) {
    let errors = '';

    if (this.validator) {
      errors += await this.validator.validate(this.props.errorMessages, ...args);
    }

    if (this.props.validate) {
      errors += await this.props.validate(...args);
    }

    return errors;
  }

  render() {
    const { children } = this.props;

    if (typeof children !== 'function') {
      throw new Error('children of FormControlWrapper must be function.');
    }

    const fieldName = getFieldName(this.props);

    return children({
      ...this.context,
      handleChange: this.handleChange,
      handleBlur: this.handleBlur,
      fieldValue: this.context.values[fieldName],
      fieldError: this.context.errors[fieldName],
      fieldTouched: this.context.touched[fieldName]
    });
  }
}

FormControlWrapper.contextType = FormContext;

FormControlWrapper.propTypes = {
  className: PropTypes.string,
  validate: PropTypes.func,
  errorMessages: PropTypes.object,
  children: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};
