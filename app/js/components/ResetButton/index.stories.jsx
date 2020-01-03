import React from 'react';
import ResetButton from '.';
import Form from '../Form';
import LabelField from '../LabelField';

const initialValues = {
  firstName: '',
  lastName: ''
};

export default { title: 'ResetButton' };

export const ResetButtonExample = () => (
  <div className="example">
    <h3>Form</h3>
    <Form initialValues={initialValues}>
      {
        ({ values, handleChange }) => (
          <form>
            <section className="section">
              <LabelField text="First Name:">
                <input
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                />
              </LabelField>
            </section>

            <section className="section">
              <LabelField text="Last Name:">
                <input
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                />
              </LabelField>
            </section>

            <ResetButton value="reset form" />
          </form>
        )
      }
    </Form>
  </div>
);
