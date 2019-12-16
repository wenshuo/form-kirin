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

function fromList(value = []) {
  return value.join(',');
}

function toList(value) {
  return value ? value.split(',') : [];
}

function uniqueGuests(value) {
  const uniqueList = [...new Set(value)];
  return uniqueList.length !== value.length ? 'Guest names must be unique.' : '';
}

export default function CustomFormFieldExample(props) {
  return (
    <div>
      <h3 className="u-text-center form-header">Guest List Form</h3>
      <Form initialValues={initialValues} onSubmit={submitForm} validateOnBlur>
        {
          ({ values, touched, errors, handleChange, handleSubmit, isSubmitting, handleReset }) => (
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
                    <TextInput id="guests" name="guests" label="who are they:" toValue={toList} fromValue={fromList} validate={uniqueGuests} />
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
