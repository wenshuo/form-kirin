import React, { Component } from 'react';

import Form from '../../components/Form';
import Field from '../../components/Field';
import Input from '../../components/BasicField';
import Checkbox from '../../components/Checkbox';
import LabelField from '../../components/LabelField';
import RadioSet from '../../components/RadioSet';
import Radio from '../../components/Radio';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import EmailField from '../../components/EmailField';
import NumberField from '../../components/NumberField';
import List from '../../components/List';

import '../index.scss';


const initialValues = {
  firstName: 'Jack',
  lastName: 'Sparrow'
};

function submitForm(values, setSubmitting) {
  alert(JSON.stringify(values));
  setTimeout(() => setSubmitting(false), 2000);
}

class ReinitializeExample extends Component {
  constructor(props) {
    super(props);

    this.state = { initialValues };
    this.resetForm = this.resetForm.bind(this);
  }

  resetForm() {
    this.setState({ initialValues: { ...initialValues } });
  }

  render() {
    return (
      <div className="example">
        <h3 className="u-text-center  form-header">Order Form</h3>
        <Form
          initialValues={this.state.initialValues}
          onSubmit={submitForm}
          validateOnBlur
          enableValidationProps
          enableReinitialize
        >
          {
            ({ values, touched, errors, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} noValidate>
                <section className="section">
                  <Field errorMessage={touched.firstName && errors.firstName}>
                    <LabelField text="First Name:">
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        minLength="5"
                        required
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
                        required
                        minLength="5"
                      />
                    </LabelField>
                  </Field>
                </section>

                <List>
                  <List.Item>
                    <button type="button" onClick={this.resetForm}>reset</button>
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
}

export const Reinitialize = () => <ReinitializeExample />;
export default { title: 'FormProps' };
