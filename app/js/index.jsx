import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';

const initialValues = {
  firstName: 'wen',
  lastName: 'huang'
};

function submitForm(values, setSubmitting) {
  console.log(values);
  setTimeout(() => setSubmitting(false), 2000);
}

function App(props) {
  return (
    <div>
      <Form initialValues={initialValues} handleSubmit={submitForm}>
        {
          ({ values, handleChange, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <label htmlFor="firstName">first name:</label>
              <input type="text" id="firstName" name="firstName" onChange={handleChange} value={values.firstName} />
              <br />
              <label htmlFor="lastName">last name:</label>
              <input type="text" id="lastName" name="lastName" onChange={handleChange} value={values.lastName} />
              <br />
              <button type="submit" disabled={isSubmitting}>submit form</button>
            </form>
          )
        }
      </Form>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#appRoot'));
