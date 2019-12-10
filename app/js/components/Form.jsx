import React, { PureComponent } from 'react';
import isEmpty from 'lodash/isEmpty';

import { isObject } from '../helpers/utils';

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

    this.state = {
      initialValues: props.initialValues,
      values: { ...props.initialValues },
      errors: {},
      isSubmitting: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async submitForm(event) {
    event.preventDefault();
    let canSubmit = true;

    // Perform form level validation if there's validate function prop
    if (typeof this.validate === 'function') {
      let errors = await this.validate(this.state.values, this.props);
      errors = { ...this.state.errors, ...errors };
      this.setState({ errors });
      canSubmit = isEmpty(errors);
    }

    if (canSubmit && this.handleSubmit) {
      this.setState({ isSubmitting: true });
      this.handleSubmit(this.state.values, this.setSubmitting);
    }
  }

  setSubmitting(value) {
    this.setState({ isSubmitting: value });
  }

  handleChange(event) {
    const el = event.target;
    const key = el.getAttribute('name') || el.getAttribute('id');

    if (!key) {
      throw new Error('Form input control must have either name or id attribute.');
    }

    this.setState({ values: { ...this.state.values, [key]: el.value } });
  }

  render() {
    const { children } = this.props;
    // render prop
    if (typeof children !== 'function') {
      throw new Error('chilren of Form component must be a function.');
    }

    return children({
      handleChange: this.handleChange,
      values: this.state.values,
      errors: this.state.errors,
      handleSubmit: this.submitForm,
      isSubmitting: this.state.isSubmitting
    });
  }
}
