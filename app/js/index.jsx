import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
import Input from './components/Field';
import Checkbox from './components/Checkbox';
import LabelField from './components/LabelField';
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

function App(props) {
  return (
    <div>
      <Form initialValues={initialValues} handleSubmit={submitForm} validateOnBlur>
        {
          ({ values, touched, errors, handleChange, handleSubmit, isSubmitting, resetForm }) => (
            <form onSubmit={handleSubmit}>
              <LabelField text="First Name:">
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  validate={validateFirst}
                />
              </LabelField>
              {
                touched.firstName && errors.firstName && <div className={styles.error}>{errors.firstName}</div>
              }
              <LabelField text="Last Name:">
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                />
              </LabelField>

              <Checkbox name="admin" id="admin" label="admin" />

              {
                values.admin && (
                  <LabelField text="Department:">
                    <Input
                      type="text"
                      id="department"
                      name="department"
                    />
                  </LabelField>
                )
              }
              <button type="button" onClick={resetForm}>reset</button>
              <button type="submit" disabled={isSubmitting}>submit form</button>
            </form>
          )
        }
      </Form>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#appRoot'));
