import React, { Component } from 'react';

import FormKirin from '../../components/FormKirin';
import Field from '../../components/Field';
import Input from '../../components/BasicField';
import Checkbox from '../../components/Checkbox';
import RadioSet from '../../components/RadioSet';
import Radio from '../../components/Radio';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import EmailField from '../../components/EmailField';
import NumberField from '../../components/NumberField';
import List from '../../components/List';

import '../index.scss';

const initialValues = {
  firstName: 'Jack',
  lastName: 'Sparrow'
};

function submitForm(values, { setSubmitting }) {
  alert(JSON.stringify(values));
  setTimeout(() => setSubmitting(false), 2000);
}

class ReinitializeExample extends Component {
  constructor(props) {
    super(props);

    this.state = { initialValues };
    this.resetForm = this.resetForm.bind(this);
  }

  resetForm() {
    this.setState({ initialValues: { ...initialValues } });
  }

  render() {
    return (
      <div className="example">
        <h3 className="u-text-center  form-header">Order Form</h3>
        <FormKirin
          initialValues={this.state.initialValues}
          onSubmit={submitForm}
          validateOnBlur
          enableValidationProps
          enableReinitialize
        >
          {
            ({ values, touched, errors, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <section className="section">
                  <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      minLength="5"
                      required
                    />
                  </Field>
                </section>

                <section className="section">
                  <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      minLength="5"
                    />
                  </Field>
                </section>

                <List>
                  <List.Item>
                    <button type="button" onClick={this.resetForm}>reset</button>
                  </List.Item>
                  <List.Item>
                    <button type="submit" disabled={isSubmitting}>submit form</button>
                  </List.Item>
                </List>
              </form>
            )
          }
        </FormKirin>
      </div>
    );
  }
}

const initialValuesForValidateOnMountExample = {
  firstName: '',
  lastName: ''
};

const ValidateOnMountExample = () => (
  <div className="example">
    <h3 className="u-text-center  form-header">Order Form</h3>
    <FormKirin
      initialValues={initialValuesForValidateOnMountExample}
      onSubmit={submitForm}
      validateOnBlur
      enableValidationProps
      validateOnMount
    >
      {
        ({ values, touched, errors, handleSubmit, handleReset, isSubmitting }) => (
          <form onSubmit={handleSubmit} noValidate>
            <section className="section">
              <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                />
              </Field>
            </section>

            <section className="section">
              <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                />
              </Field>
            </section>

            <List>
              <List.Item>
                <button type="button" onClick={handleReset}>reset</button>
              </List.Item>
              <List.Item>
                <button type="submit" disabled={isSubmitting}>submit form</button>
              </List.Item>
            </List>
          </form>
        )
      }
    </FormKirin>
  </div>
);

class ValidateOnReinitializeExample extends Component {
  constructor(props) {
    super(props);

    this.state = { initialValues };
    this.resetForm = this.resetForm.bind(this);
  }

  resetForm() {
    this.setState({ initialValues: { } });
  }

  render() {
    return (
      <div className="example">
        <h3 className="u-text-center  form-header">Order Form</h3>
        <FormKirin
          initialValues={this.state.initialValues}
          onSubmit={submitForm}
          validateOnBlur
          enableValidationProps
          enableReinitialize
          validateOnReinitialize
        >
          {
            ({ values, touched, errors, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <section className="section">
                  <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      minLength="5"
                      required
                    />
                  </Field>
                </section>

                <section className="section">
                  <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      minLength="5"
                    />
                  </Field>
                </section>

                <List>
                  <List.Item>
                    <button type="button" onClick={this.resetForm}>reset</button>
                  </List.Item>
                  <List.Item>
                    <button type="submit" disabled={isSubmitting}>submit form</button>
                  </List.Item>
                </List>
              </form>
            )
          }
        </FormKirin>
      </div>
    );
  }
}

const initialValuesForValidateOnResetExample = {
  firstName: '',
  lastName: ''
};

const ValidateOnResetExample = () => (
  <div className="example">
    <h3 className="u-text-center  form-header">Order Form</h3>
    <FormKirin
      initialValues={initialValuesForValidateOnResetExample}
      onSubmit={submitForm}
      validateOnBlur
      enableValidationProps
      validateOnReset
    >
      {
        ({ values, touched, errors, handleSubmit, handleReset, isSubmitting }) => (
          <form onSubmit={handleSubmit} noValidate>
            <section className="section">
              <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                />
              </Field>
            </section>

            <section className="section">
              <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                />
              </Field>
            </section>

            <List>
              <List.Item>
                <button type="button" onClick={handleReset}>reset</button>
              </List.Item>
              <List.Item>
                <button type="submit" disabled={isSubmitting}>submit form</button>
              </List.Item>
            </List>
          </form>
        )
      }
    </FormKirin>
  </div>
);

const resource = {
  get(values) {
    return sessionStorage.getItem('formExampleData') || {};
  },
  update(values, { setSubmitting }) {
    sessionStorage.setItem('formExampleData', JSON.stringify(values));
    setSubmitting(false);
    alert('Data is saved to sessionStorage.');
  }
};

const ResourceExample = () => (
  <div className="example">
    <h3 className="u-text-center  form-header">Order Form</h3>
    <FormKirin
      validateOnBlur
      enableValidationProps
      resource={resource}
    >
      {
        ({ values, touched, errors, handleSubmit, handleReset, isSubmitting }) => (
          <form onSubmit={handleSubmit} noValidate>
            <section className="section">
              <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                />
              </Field>
            </section>

            <section className="section">
              <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                />
              </Field>
            </section>

            <List>
              <List.Item>
                <button type="button" onClick={handleReset}>reset</button>
              </List.Item>
              <List.Item>
                <button type="submit" disabled={isSubmitting}>submit form</button>
              </List.Item>
            </List>
          </form>
        )
      }
    </FormKirin>
  </div>
);

export const Reinitialize = () => <ReinitializeExample />;
export const ValidateOnMount = () => <ValidateOnMountExample />;
export const ValidateOnReinitialize = () => <ValidateOnReinitializeExample />;
export const ValidateOnReset = () => <ValidateOnResetExample />;
export const Resource = () => <ResourceExample />;

export default { title: 'FormProps' };
