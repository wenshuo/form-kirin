import React from 'react';

import FormKirin from '../../components/FormKirin';
import Field from '../../components/Field';
import Input from '../../components/BasicField';
import Checkbox from '../../components/Checkbox';
import RadioSet from '../RadioSet';
import Radio from '../../components/Radio';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import EmailField from '../../components/EmailField';
import NumberField from '../../components/NumberField';
import List from '../List';

import { addValidations } from '../../validation/validator';

import '../index.scss';

addValidations({
  isEmail({ value, fieldName }) {
    return !/^.+@.+\..+$/.test(value) && `${value || "''"} is not a valid email address.`;
  }
});

const validationProps = {
  positive({ value, fieldName }) {
    return value && value <= 0 ? `${fieldName} must be a positive number.` : '';
  }
};

const initialValues = {
  firstName: ''
};

const firstNameErrors = {
  required({ fieldName }) {
    return `${fieldName} can't be blank.`;
  }
};

function submitForm(values, { setSubmitting }) {
  alert(JSON.stringify(values));
  setTimeout(() => setSubmitting(false), 2000);
}

function BuiltinValidationExample() {
  return (
    <div className="example">
      <h3 className="u-text-center  form-header">Order Form</h3>
      <FormKirin
        initialValues={initialValues}
        onSubmit={submitForm}
        validateOnBlur
        enableValidationProps
      >
        {
          ({ values, touched, errors, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
              <section className="section">
                <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    minLength="5"
                    required
                    errorMessages={firstNameErrors}
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

              <section className="section">
                <Field errorMessage={touched.email && errors.email} labelText="Email:">
                  <EmailField
                    id="email"
                    name="email"
                    required
                    isEmail
                  />
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.quantity && errors.quantity} labelText="How many do you want:">
                  <NumberField
                    id="quantity"
                    name="quantity"
                    max="10"
                  />
                </Field>
              </section>

              <List>
                <List.Item>
                  <button type="reset" disabled={isSubmitting}>reset</button>
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

function CustomValidationExample() {
  return (
    <div className="example">
      <h3 className="u-text-center  form-header">Order Form</h3>
      <FormKirin
        initialValues={initialValues}
        onSubmit={submitForm}
        validateOnBlur
        enableValidationProps
        validationProps={validationProps}
      >
        {
          ({ values, touched, errors, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
              <section className="section">
                <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    minLength="5"
                    required
                    errorMessages={firstNameErrors}
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

              <section className="section">
                <Field errorMessage={touched.email && errors.email} labelText="Email:">
                  <EmailField
                    id="email"
                    name="email"
                    isEmail
                    required
                  />
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.quantity && errors.quantity} labelText="How many do you want:">
                  <NumberField
                    id="quantity"
                    name="quantity"
                    positive
                  />
                </Field>
              </section>

              <List>
                <List.Item>
                  <button type="reset" disabled={isSubmitting}>reset</button>
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

export const BuiltinValidationProps = () => <BuiltinValidationExample />;
export const CustomValidationPropsAtFormLevel = () => <CustomValidationExample />;
export default { title: 'ValidationProps' };
