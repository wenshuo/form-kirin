import React from 'react';
import ResetButton from '.';
import FormKirin from '../FormKirin';
import Field from '../Field';

const initialValues = {
  firstName: '',
  lastName: ''
};

export default { title: 'ResetButton' };

export const ResetButtonExample = () => (
  <div className="example">
    <h3>Form</h3>
    <FormKirin initialValues={initialValues}>
      {
        ({ values, handleChange }) => (
          <form>
            <section className="section">
              <Field labelText="First Name:">
                <input
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                />
              </Field>
            </section>

            <section className="section">
              <Field labelText="Last Name:">
                <input
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                />
              </Field>
            </section>

            <ResetButton value="reset form" />
          </form>
        )
      }
    </FormKirin>
  </div>
);
