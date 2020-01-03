import React from 'react';

import Form from '../../components/Form';
import Field from '../../components/Field';
import Input from '../../components/BasicField';
import Checkbox from '../../components/Checkbox';
import LabelField from '../../components/LabelField';
import RadioSet from '../../components/RadioSet';
import Radio from '../../components/Radio';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import EmailField from '../../components/EmailField';
import NumberField from '../../components/NumberField';
import List from '../../components/List';

import { addValidations } from '../../validation/validator';

import '../index.scss';

// addValidations({
//   isEmail({ value, fieldName }) {
//     return !/^.+@.+\..+$/.test(value) && `${value || "''"} is not a valid email address.`;
//   }
// });

const validationProps = {
  isEmail({ value, fieldName }) {
    return !/^.+@.+\..+$/.test(value) && `${value || "''"} is not a valid email address.`;
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

function submitForm(values, setSubmitting) {
  alert(JSON.stringify(values));
  setTimeout(() => setSubmitting(false), 2000);
}

function BuiltinValidationExample() {
  return (
    <div className="example">
      <h3 className="u-text-center  form-header">Order Form</h3>
      <Form
        initialValues={initialValues}
        onSubmit={submitForm}
        validateOnBlur
        enableValidationProps
        validationProps={validationProps}
      >
        {
          ({ values, touched, errors, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit} noValidate>
              <section className="section">
                <Field errorMessage={touched.firstName && errors.firstName}>
                  <LabelField text="First Name:">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      minLength="5"
                      required
                      errorMessages={firstNameErrors}
                    />
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.lastName && errors.lastName}>
                  <LabelField text="Last Name:">
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      minLength="5"
                    />
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.email && errors.email}>
                  <LabelField text="Email:">
                    <EmailField
                      id="email"
                      name="email"
                      isEmail
                    />
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.quantity && errors.quantity}>
                  <LabelField text="How many do you want:">
                    <NumberField
                      id="quantity"
                      name="quantity"
                      max="10"
                    />
                  </LabelField>
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
      </Form>
    </div>
  );
}

export const FormExample = () => <BuiltinValidationExample />;
export default { title: 'BuiltinValidation' };
