import React from 'react';

import Form from '../../components/Form';
import List from '../../components/List';
import TextInput from './CustomInput';
import Checkbox from './CustomCheckbox';

const initialValues = {};

function submitForm(values, setSubmitting) {
  alert(JSON.stringify(values));
  setTimeout(() => setSubmitting(false), 2000);
}

function isRequired(value, name) {
  if (!value) {
    return `${name} is required and can't be empty.`;
  }

  return '';
}

function uniqueGuests(value) {
  if (value) {
    const names = value.split(',');
    const uniqueList = [...new Set(names)];
    return uniqueList.length !== names.length ? 'Guest names must be unique.' : '';
  }

  return '';
}

export default function CustomFormFieldExample() {
  return (
    <div>
      <h3 className="u-text-center form-header">Guest List Form</h3>
      <Form initialValues={initialValues} onSubmit={submitForm} validateOnBlur>
        {
          ({ values, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit}>

              <section className="section">
                <TextInput id="firstName" name="firstName" validate={isRequired} label="First Name:" />
              </section>

              <section className="section">
                <TextInput id="lastName" name="lastName" validate={isRequired} label="Last Name:" />
              </section>

              <section className="section">
                <Checkbox id="hasGuests" name="hasGuests" label="Are you going to bring any guests?" />
              </section>

              {
                values.hasGuests && (
                  <section className="section">
                    <TextInput id="guests" name="guests" label="who are they:" validate={uniqueGuests} />
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
