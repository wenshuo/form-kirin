import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
import Field from './components/Field';
import Input from './components/BasicField';
import Checkbox from './components/Checkbox';
import LabelField from './components/LabelField';
import RadioSet from './components/RadioSet';
import Radio from './components/Radio';
import List from './components/List';
import styles from './index.module.scss';

const initialValues = {
  firstName: 'wen',
  lastName: 'huang'
};

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
  if (values.admin && !values.department) {
    return {
      department: 'Department field can be empty for amdin.'
    };
  }

  return {};
}

function App(props) {
  return (
    <div>
      <Form initialValues={initialValues} handleSubmit={submitForm} validateOnBlur validate={validateForm}>
        {
          ({ values, touched, errors, handleChange, handleSubmit, isSubmitting, resetForm }) => (
            <form onSubmit={handleSubmit}>
              <section className="section">
                <Field errorMessage={touched.firstName && errors.firstName}>
                  <LabelField text="First Name:">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      validate={validateFirst}
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
                    />
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Checkbox name="admin" id="admin" label="admin" />
              </section>

              {
                values.admin && (
                  <section className="section">
                    <Field errorMessage={touched.department && errors.department}>
                      <LabelField text="Department:">
                        <Input
                          type="text"
                          id="department"
                          name="department"
                        />
                      </LabelField>
                    </Field>
                  </section>
                )
              }

              <section className="section">
                <RadioSet>
                  <Radio name="role" id="role1" value="manager" label="Manager" />
                  <Radio name="role" id="role2" value="engineer" label="Engineer" />
                  <Radio name="role" id="role3" value="QA" label="QA" />
                </RadioSet>
              </section>

              <List>
                <List.Item>
                  <button type="button" onClick={resetForm}>reset</button>
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

ReactDOM.render(<App />, document.querySelector('#appRoot'));
