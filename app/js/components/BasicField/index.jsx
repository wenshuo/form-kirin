import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cx from 'classnames';

import FormContext from '../../contexts/form';
import { getFieldName } from '../../helpers/utils';

import styles from './index.module.scss';

const CHECKABLE_TYPES = ['radio', 'checkbox'];

export default class BasicField extends Component {
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

  isCheckable(type) {
    return CHECKABLE_TYPES.includes(type);
  }

  fieldValue(el) {
    return el.getAttribute('type') === 'checkbox' ? el.checked : el.value;
  }

  render() {
    const { className, tagName: Wrapper } = this.props;
    const props = omit(this.props, ['handleBlur', 'handleChange', 'validate',  'tagName']);
    const value = this?.context?.values?.[getFieldName(this.props)];

    let inputProps = {};

    if (this.props.type === 'checkbox') {
      inputProps = { checked: !!value };
    } else if (this.props.type === 'radio') {
      inputProps = { checked: value === this.props.value };
    } else {
      inputProps = { value:  value || '' };
    }

    return (
      <Wrapper
        className={cx(styles.input, className)}
        {...props}
        {...inputProps}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

BasicField.contextType = FormContext;
BasicField.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string
};

BasicField.defaultProps = {
  tagName: 'input'
};
