import React from 'react';

import Form from '../../components/Form';
import LabelField from '../../components/LabelField';
import Field from '../../components/Field';
import List from '../../components/List';

const initialValues = {
  firstName: '',
  lastName: '',
  quantity: '',
  products: ''
};

function submitForm(values, setSubmitting) {
  alert(JSON.stringify(values));
  setTimeout(() => setSubmitting(false), 2000);
}

const validate = {
  firstName(fieldValue) {
    return !fieldValue ? 'First name is required.' : '';
  },
  lastName(fieldValue) {
    return !fieldValue ? 'Last name is required.' : '';
  },
  quantity(fieldValue) {
    let errors = '';

    if (!fieldValue) {
      errors = 'Quantity is required.';
    } else if (Number(fieldValue) > 10) {
      errors = 'Please select 1 to 9.';
    }

    return errors;
  }
};

function RenderPropExample() {
  return (
    <div className="example">
      <h3 className="u-text-center  form-header">Basic Form</h3>
      <Form initialValues={initialValues} onSubmit={submitForm} validate={validate}>
        {
          ({ values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, handleReset }) => (
            <form onSubmit={handleSubmit}>
              <section className="section">
                <Field errorMessage={touched.firstName && errors.firstName}>
                  <LabelField text="First Name:">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.lastName && errors.lastName}>
                  <LabelField text="Last Name:">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.products && errors.products}>
                  <LabelField text="Choose a product to buy:">
                    <select id="products" name="products" value={values.products} onChange={handleChange} onBlur={handleBlur}>
                      <option value=""></option>
                      <option value="iPhone_11">Iphone 11</option>
                      <option value="Macbook_Air">Macbook Air</option>
                      <option value="Keyboard">Keyboard</option>
                      <option value="Mouse">Mouse</option>
                    </select>
                  </LabelField>
                </Field>
              </section>

              <section className="section">
                <Field errorMessage={touched.quantity && errors.quantity}>
                  <LabelField text="Quantity:">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </LabelField>
                </Field>
              </section>

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

export default { title: 'RenderProp' };
export const FormExample = () => <RenderPropExample />;
