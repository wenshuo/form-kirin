import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cx from 'classnames';

import FormContext from '../../contexts/form';
import { getFieldName } from '../../helpers/utils';

export default class MagicWrapper extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    if (this.context) {
      const fieldName = getFieldName(this.props);

      this.context.setField({
        validate: this.props.validate,
        name: fieldName
      });
    }
  }

  componentWillUnmount() {
    if (this.context) {
      this.context.unsetField(getFieldName(this.props));
    }
  }

  async validate(fieldName, fieldValue) {
    const { setErrors, values } = this.context;

    if (this.props.validate) {
      try {
        const errors = await this.props.validate(fieldValue, values);
        setErrors({ [fieldName]: errors });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async handleChange(event) {
    event.stopPropagation();

    if (this.context) {
      const { handleChange, validateOnChange } = this.context;
      const fieldName = getFieldName(this.props);
      const fieldValue = this.fieldValue(event.target);

      handleChange(fieldName, fieldValue);

      if (validateOnChange) {
        await this.validate(fieldName, fieldValue);
      }
    }

    // call user provided handleChange method
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  async handleBlur(event) {
    event.stopPropagation();

    if (this.context) {
      const { handleBlur, validateOnBlur } = this.context;
      const fieldName = getFieldName(this.props);

      handleBlur(fieldName);

      if (validateOnBlur) {
        await this.validate(fieldName, this.fieldValue(event.target));
      }
    }

    // call user provided handleBlur method
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  fieldValue(el) {
    return el.getAttribute('type') === 'checkbox' ? el.checked : el.value;
  }

  render() {
    const { children } = this.props;

    if (typeof children !== 'function') {
      throw new Error('children of MagicWrapper must be function.');
    }

    return children({
      ...this.context,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      value: this?.context?.values?.[getFieldName(this.props)]
    });
  }
}

MagicWrapper.contextType = FormContext;

MagicWrapper.propTypes = {
  className: PropTypes.string
};
