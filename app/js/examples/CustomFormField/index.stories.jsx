import React from 'react';

import Form from '../../components/Form';
import List from '../../components/List';
import Field from '../../components/Field';
import LabelField from '../../components/LabelField';
import TextInput from './CustomInput';
import Checkbox from './CustomCheckbox';
import MultiSelect from './MultiSelect';
import '../index.scss';

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

const items = [
  { label: 'Jack' },
  { label: 'Rose' },
  { label: 'Mary' },
  { label: 'Tom' },
  { label: 'Lily' }
];

const validate = {
  guests(fieldValue) {
    if (fieldValue) {
      const names = fieldValue.split(',');
      const uniqueList = [...new Set(names)];
      return uniqueList.length !== names.length ? 'Guest names must be unique.' : '';
    }

    return '';
  }
};

const validateForm = (values) => {
  const errors = {};

  if (values.firstName && values.firstName.length > 20) {
    errors.firstName = 'firstName can not be longer than 20 characters.';
  }

  if (values.lastName && values.lastName.length > 20) {
    errors.lastName = 'lastName can not be longer than 20 characters.';
  }

  if (values.guests && values.guests.split(',').length > 2) {
    errors.guests = 'You can not select more than 2 guests.';
  }

  return errors;
};

function CustomFormFieldExample() {
  return (
    <div className="example">
      <h3 className="u-text-center form-header">Guest List Form</h3>
      <Form initialValues={initialValues} onSubmit={submitForm} validateOnBlur validate={validate} validateForm={validateForm}>
        {
          ({ values, touched, errors, handleSubmit, isSubmitting, handleReset }) => (
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
                    <Field errorMessage={touched.guests && errors.guests}>
                      <LabelField text="Select your guest:">
                        <MultiSelect name="guests" validate={uniqueGuests} items={items} />
                      </LabelField>
                    </Field>
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

export const FormExample = () => <CustomFormFieldExample />;
export default { title: 'CustomFormField' };
