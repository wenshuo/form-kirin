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
  }

  componentDidMount() {
    if (this.context) {
      const fieldName = getFieldName(this.props);

      this.context.setField({
        validate: this.props.validate,
        toValue: this.props.toValue,
        fromValue: this.props.fromValue,
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
    event.stopPropagation();

    if (this.context) {
      const { handleChange } = this.context;
      const fieldName = getFieldName(this.props);
      const fieldValue = this.fieldValue(event.target);

      handleChange(fieldName, fieldValue, this.props.handleChange, event);
    }
  }

  handleBlur(event) {
    event.stopPropagation();

    if (this.context) {
      const { handleBlur } = this.context;
      const fieldName = getFieldName(this.props);

      handleBlur(fieldName, this.props.handleBlur, event);
    }
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
      throw new Error('children of MagicWrapper must be function.');
    }

    const fieldName = getFieldName(this.props);

    return children({
      ...this.context,
      handleChange: this.handleChange,
      handleBlur: this.handleBlur,
      value: this?.context?.values?.[fieldName],
      rawValue: this?.context?.rawValues?.[fieldName],
      error: this?.context?.errors?.[fieldName],
      touched: this?.context?.touched?.[fieldName]
    });
  }
}

MagicWrapper.contextType = FormContext;

MagicWrapper.propTypes = {
  className: PropTypes.string
};
