import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cx from 'classnames';

import FormContext from '../../contexts/form';
import { getFieldName } from '../../helpers/utils';

export default class FormControlWrapper extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
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

  handleChange(event) {
    this?.context.handleChange?.(event, this.props.handleChange, event);
  }

  handleBlur(event) {
    this?.context.handleBlur?.(event, this.props.handleBlur, event);
  }

  fieldValue(el) {
    const elementName = el.tagName.toLowerCase();
    // handle select with or without multiple
    if (elementName === 'select') {
      return Array.from(el.selectedOptions).map(e => e.value);
    }

    return el.getAttribute('type') === 'checkbox' ? el.checked : el.value;
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
      value: this?.context?.values?.[fieldName],
      error: this?.context?.errors?.[fieldName],
      touched: this?.context?.touched?.[fieldName]
    });
  }
}

FormControlWrapper.contextType = FormContext;

FormControlWrapper.propTypes = {
  className: PropTypes.string
};
