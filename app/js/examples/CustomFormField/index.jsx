import React from 'react';

import Form from '../../components/Form';
import List from '../../components/List';
import TextInput from './CustomInput';
import Checkbox from './CustomCheckbox';

const initialValues = {};

function submitForm(values, setSubmitting) {
  console.log(values);
  setTimeout(() => setSubmitting(false), 2000);
}

function validateFirst(value) {
  if (value.length < 5) {
    return 'first name must be 5 char longs.'
  }

  return '';
}

function validateForm(values) {
  const errors = {};

  if (values.admin && !values.department) {
    errors.department = 'Department field can be empty for amdin.';
  }

  if (!values.bio || values.bio.length < 20) {
    errors.bio = 'At least tell me more about you.'
  }

  return errors;
}

export default function CustomFormFieldExample(props) {
  return (
    <div>
      <Form initialValues={initialValues} onSubmit={submitForm} validateOnBlur validate={validateForm}>
        {
          ({ values, touched, errors, handleChange, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit}>

              <section className="section">
                <TextInput id="firstName" name="firstName" validate={validateFirst} label="First Name:" />
              </section>

              <section className="section">
                <TextInput id="lastName" name="lastName" validate={validateFirst} label="First Name:" />
              </section>

              <section className="section">
                <Checkbox id="hasGuests" name="hasGuests" label="Are you going to bring any guests?" />
              </section>

              {
                values.hasGuests && (
                  <section className="section">
                    <TextInput id="guests" name="guests" label="who are they:" />
                  </section>
                )
              }

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
