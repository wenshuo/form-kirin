import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
import Field from './components/Field';
import Input from './components/BasicField';
import Checkbox from './components/Checkbox';
import LabelField from './components/LabelField';
import RadioSet from './components/RadioSet';
import Radio from './components/Radio';
import Textarea from './components/Textarea';
import Select from './components/Select';
import List from './components/List';

import './index.scss';

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
  const errors = {};

  if (values.admin && !values.department) {
    errors.department = 'Department field can be empty for amdin.';
  }

  if (!values.bio || values.bio.length < 20) {
    errors.bio = 'At least tell me more about you.'
  }

  return errors;
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

              <section className="section">
                <Field errorMessage={touched.source && errors.source}>
                  <LabelField text="How do know us:">
                    <Select id="source" name="source">
                      <option></option>
                      <option value="internet">Internet</option>
                      <option value="newspaper">Newspaper</option>
                      <option value="friends">Friends</option>
                    </Select>
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.bio && errors.bio}>
                  <LabelField text="Tell me about you:">
                    <Textarea id="bio" name="bio" rows="10" cols="50" />
                  </LabelField>
                </Field>
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
