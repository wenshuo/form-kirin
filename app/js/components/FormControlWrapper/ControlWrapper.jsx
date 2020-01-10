// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getFieldName } from '../../helpers/utils';
import { getValidator } from '../../validation';

export default class ControlWrapper extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    if (this.props.formContext) {
      const { enableValidationProps, setField, validationProps } = this.props.formContext;

      const fieldName = getFieldName(this.props);
      this.validator = getValidator(this.props, validationProps);

      setField({
        validate: ((enableValidationProps && this.validator) || this.props.validate) ? this.validate : null,
        name: fieldName,
        context: this
      });
    }
  }

  componentWillUnmount() {
    if (this.props.formContext) {
      this.props.formContext.unsetField(getFieldName(this.props));
    }
  }

  handleChange(event) {
    this.props.formContext.handleChange(event, this.props.onChange, event);
  }

  handleBlur(event) {
    this.props.formContext.handleBlur(event, this.props.onBlur, event);
  }

  async validate(...args) {
    let errors = '';

    if (this.validator) {
      errors += await this.validator.validate(...args);
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
      ...this.props.formContext,
      handleChange: this.handleChange,
      handleBlur: this.handleBlur,
      fieldValue: this.props.formContext.values[fieldName],
      fieldError: this.props.formContext.errors[fieldName],
      fieldTouched: this.props.formContext.touched[fieldName]
    });
  }
}

ControlWrapper.propTypes = {
  className: PropTypes.string,
  validate: PropTypes.func,
  errorMessages: PropTypes.object,
  children: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  formContext: PropTypes.object
};
