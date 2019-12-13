import React, { Component } from 'react';
import omit from 'lodash/omit';

import FormContext from '../../contexts/form';
import { getFieldName } from '../../helpers/utils';

import styles from './index.module.scss';

const CHECKABLE_TYPES = ['radio', 'checkbox'];

export default class Input extends Component {
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
    if (this.props.handleChange) {
      this.props.handleChange(event);
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
    if (this.props.handleBlur) {
      this.props.handleBlur(event);
    }
  }

  isCheckable(type) {
    return CHECKABLE_TYPES.includes(type);
  }

  fieldValue(el) {
    return this.isCheckable(el.getAttribute('type')) ? el.checked : el.value;
  }

  render() {
    const props = omit(this.props, ['handleBlur', 'handleChange', 'validate', 'value']);
    const value = this?.context?.values?.[getFieldName(this.props)];
    const inputProps = this.isCheckable(this.props.type) ? { checked: !!value } : { value };

    return (
      <input
        className={styles.input}
        {...props}
        {...inputProps}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

Input.contextType = FormContext;
