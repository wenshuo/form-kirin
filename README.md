## form-kirin

### features
1. get values in and out the form
2. validations and error handling
  - field and form level
  - sync and sync
  - support validation props including html native props and ability to extend the props
3. resource binding
4. form submit and reset

### To see examples
There are a few examples written using react storybooks.
```
1. npm install
1. npm start
```

### How does it work ?
The FormKirin component keep all related state internally and pass those data to your form in a render prop.

### Get values into the form and get values out
There are a few different ways to get values into the form.
1. initialization by passing initialValues prop as object
1. bind resource to the form and define a get method
1. setValues and setFieldValue imperative methods, this is useful when creating custom form controls.

Example: initialValues and enableReinitialize
Initialize form using initialValues prop. When enableReinitialize is on, form-kirin will reinitialize form when initialValues changes.
Also it resets other form state such as errors, touched and etc. Optionally we can re-run validation when form is reinitialized by configuring the validateOnReinitialize prop.
```
import { FormKirin } from 'form-kirin';

const initialValues = {
  firstName: 'Jack',
  lastName: 'Sparrow'
};

<FormKirin initialValues={initialValues} enableReinitialize validateOnReinitialize>
  {
    ({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
      <form>
        <input
          type="text"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <input
          type="text"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

Example: bind resource to form
Initialize form using values returned from resource.get method, supports sync and async methods.
```
import { FormKirin } from 'form-kirin';

const resource = {
  get(values, setters, props) {
    // Assume we fetch from server
    ...
    return values;
  }
};
// No need to pass initialValues when using resource.

<FormKirin resource={resource}>
  {
    ({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
      <form>
        <input
          type="text"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <input
          type="text"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

### get values out of the form
1. the FormKirin component will pass current values to the render prop so that the form controls can display latest form values.
2. onSubmit handler will receive current form values

Example: form submission
```
import { FormKirin } from 'form-kirin';

const initialValues = {
  firstName: 'Jack',
  lastName: 'Sparrow'
};

// onSubmit receive current form values, an object of setter methods, and current set of props.
// form-kirin set isSubmitting flag to true before form submission
// then we have to set isSubmitting to false when form submission is done using setSubmitting method.
function onSubmit(values, { setSubmitting }, props) {
  // after submit values to server
  setSubmitting(false);
}

// set custom onSubmit handler on FormKirin component and then attach the handleSubmit as onSubmit to the html form component.
// alternatively we could use the built-in Form component, it automatically attach the handleSubmit to its onSubmit prop, which save us
// some typing.
<FormKirin initialValues={initialValues} onSubmit={onSubmit}>
  {
    ({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <input
          type="text"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

### reset form values
pass handleReset from the render prop to the html form component's onReset prop, it will reset the form values to whatever values of the initialValues prop and also it reset all other form data such as errors, touched, and etc and Optionally re-run validation when validateOnReset
is on.

Example: reset form
```
import { FormKirin } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

function submitForm(values, { setSubmitting }) {
  ...
}

// form-kirin will reset form values and call this method if specified
// This method receives current form values, an object of setter methods, and current set of props.
function onReset(values, setters, props) {
  // perform additional logics
  ...
}

<FormKirin initialValues={initialValues} onSubmit={submitForm} onReset={onReset}>
  {
    ({ values, handleChange, handleBlur, handleSubmit, isSubmitting, handleReset }) => (
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <input
          type="text"
          id="lastName"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button type="reset" disabled={isSubmitting}>reset</button>
        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

### How to create forms ?

Example: use native form controls.
It is a little bit verbose to create form in this way because we have to pass value, handleChange, handleBlur to each form control. Fortunately, form-kirin comes with form controls that hide this details for you, please see next example.
```
import { FormKirin } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

function submitForm(values, { setSubmitting }) {
  ...
}

<FormKirin initialValues={initialValues} onSubmit={submitForm}>
  {
    ({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <input
          type="text"
          id="lastName"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

Example: use form controls from form-kirin, under the hook, those build-in form controls use react context to read the data from the FormKirin component.
```
import {
  FormKirin,
  Form,
  Field,
  BasicField: Input,
  Checkbox,
  RadioSet,
  Radio,
  EmailField,
  NumberField,
  Textarea
} from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

function onSubmit() {
  ...
}

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <Form>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <Input
              type="text"
              id="firstName"
              name="firstName"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <Input
              type="text"
              id="lastName"
              name="lastName"
            />
          </Field>
        </section>

        <section className="section">
          <Checkbox name="admin" id="admin" label="admin" />
        </section>

        {
          values.admin && (
            <section className="section">
              <Field errorMessage={touched.department && errors.department} labelText="Department:">
                <Input
                  type="text"
                  id="department"
                  name="department"
                />
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
          <Field errorMessage={touched.source && errors.source} labelText="How do know us:">
            <Select id="source" name="source" multiple size={2}>
              <option></option>
              <option value="internet">Internet</option>
              <option value="newspaper">Newspaper</option>
              <option value="friends">Friends</option>
              <option value="others">others</option>
            </Select>
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.email && errors.email} labelText="Email:">
            <EmailField
              id="email"
              name="email"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.years && errors.years} labelText="How long have you been working here:">
            <NumberField
              id="years"
              name="years"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.bio && errors.bio} labelText="Tell me about you:">
            <Textarea id="bio" name="bio" rows="10" cols="50" />
          </Field>
        </section>

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </Form>
    )
  }
</FormKirin>
```

Example: use MagicWrapper component to build custom form control.
```
import { FormKirin, Form, MagicWrapper } from 'form-kirin';

// Create a multi select component using magic wrapper.
// The MagicWrapper component accept a render prop and pass all necessary data to the render prop function.
class MultiSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.hideDropdown = this.hideDropdown.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.hideDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown);
  }

  hideDropdown(event) {
    const classes = event.target.getAttribute('class') || '';

    if (!classes.includes(styles.item) && !classes.includes(styles.control)) {
      this.setState({ isOpen: false });
    }
  }

  showDropdown() {
    this.setState({ isOpen: true });
  }

  handleClick(item, currentValue = '', setValue) {
    if (!currentValue.includes(item.label)) {
      this.setState({ isOpen: false });
      setValue(this.props.name, `${currentValue}${currentValue ? ',' : ''}${item.label}`);
    }
  }

  render() {
    const { name, items } = this.props;

    return (
      <MagicWrapper>
        {
          ({ handleChange, handleBlur, values, setFieldValue }) => (
            <div>
              <input
                className={styles.control}
                type="text"
                name={name}
                onChange={handleChange}
                onFocus={this.showDropdown}
                onBlur={handleBlur}
                value={values[name] || ''}
                autoComplete="off"
              />
              {
                this.state.isOpen && (
                  <ul className={styles.container}>
                    {
                      items.map(item => (
                        <li
                          className={styles.item}
                          key={item.label}
                          onClick={() => this.handleClick(item, values[name], setFieldValue)}
                        >
                          {item.label}
                        </li>
                      ))
                    }
                  </ul>
                )
              }
            </div>
          )
        }
      </MagicWrapper>
    );
  }
}

// use MultiSelect component that is created above
const items = [
  { label: 'apple' },
  { label: 'pear' },
  { label: 'banana' }
];

<FormKirin>
  {
    ({ isSubmitting }) => (
      <Form>
        <MultiSelect name="fruit" items={items} />
        <button type="submit" disabled={isSubmitting}>submit form</button>
      </Form>
    )
  }
</FormKirin>
```

### Data validations
Form-kirin supports form and field level, sync and async data validations in two different ways, functions and validation props.

Form-kirin will run validations at different life cycle of a form, and we can control when to trigger validations by passing props(validateOnBlur, validateOnChange and more, please see the api for more information) to the FormKirin component, by default form-kirin will only run validations right before form submission.

Example: synchronous form level and field level validations.
```
import { FormKirin, Field, BasicField: Input } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

function submitForm(values) {
  ...
}

// synchronous form level validation
function validateForm(values) {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'first name is required.';
  }

  if (!values.firstName) {
    errors.firstName = 'first name is required.';
  }
  // errors should mimic the shape of values
  return errors;
}

// synchronous field validation
function validateName(value, fieldName, values) {
  return value && value.length < 5 ? 'name must have at least 5 characters.' : '';
}

// In this example, we want to run field level validations when form control lose focus.
// Note that form-kirin also run field and form level validations before form submission, this behavior is not configurable at this moment.
// Also field level validation errors are merged with form level validation errors by concatenating the error messages.

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateOnBlur
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              validate={validateName}
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <Input
              type="text"
              id="lastName"
              name="lastName"
              validate={validateName}
            />
          </Field>
        </section>

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

Example: asynchronous form level and field level validations.
```
import { FormKirin, Field, BasicField: Input } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

function submitForm(values) {
  ...
}

// asynchronous form level validation
function validateForm(values) {
  // asynchronous validation must return a promise
  // we can run server validations but for simplicity we just wrap it in a promise in this example.
  return new Promise((resolve) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'first name is required.';
    }

    if (!values.firstName) {
      errors.firstName = 'first name is required.';
    }
    // errors should mimic the shape of values
    resolve(errors);
  });
}

// asynchronous field validation
function validateName(value, fieldName, values) {
  // asynchronous validation must return a promise
  // we can run server validations but for simplicity we just wrap it in a promise in this example.
  return new Promise((resolve) => {
    resolve(value && value.length < 5 ? 'name must have at least 5 characters.' : '');
  });
}

// In this example, we want to run field level validations when form control lose focus.
// Note that form-kirin also run field and form level validations before form submission, this behavior is not configurable at this moment.
// Also field level validation errors are merged with form level validation errors by concatenating the error messages.

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateOnBlur
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              validate={validateName}
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <Input
              type="text"
              id="lastName"
              name="lastName"
              validate={validateName}
            />
          </Field>
        </section>

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

Example: field level validations for built-in form controls via props. Form-kirin comes with validations for native html attributes (required, min, max, maxlength, minlength, and pattern), and we can overwrite the error message for these props by passing errorMessages prop to those built-in form controls. The errorMessages should be an object that contains key for a validation prop such as required, min and etc and the value should be the error message for the prop. By default, validation props are disabled, we can enable this feature by passing enableValidationProps to the FormKirin component.

```
import { FormKirin, Field, NumberField, EmailField, BasicField: Input } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

// Overwrite error message for the required validation prop
const firstNameErrors = {
  required({ fieldName }) {
    return `${fieldName} can't be blank.`;
  }
};

function submitForm(values, { setSubmitting }) {
  ...
}

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateOnBlur
  enableValidationProps
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              minLength="5"
              required
              errorMessages={firstNameErrors}
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              minLength="5"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.email && errors.email} labelText="Email:">
            <EmailField
              id="email"
              name="email"
              required
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.quantity && errors.quantity} labelText="How many do you want:">
            <NumberField
              id="quantity"
              name="quantity"
              max="10"
            />
          </Field>
        </section>

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

Example: create new validation prop by passing validationProps prop to the FormKirin component.
```
import { FormKirin, Field, NumberField, EmailField, BasicField: Input } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

// add new validation props at the form level
// we can use the new validation prop in any built-in form controls within this form.
const validationProps = {
  positive({ value, fieldName }) {
    return value && value <= 0 ? `${fieldName} must be a positive number.` : '';
  }
};

function submitForm(values, { setSubmitting }) {
  ...
}

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateOnBlur
  enableValidationProps
  validationProps={validationProps}
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              minLength="5"
              required
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              minLength="5"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.email && errors.email} labelText="Email:">
            <EmailField
              id="email"
              name="email"
              required
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.quantity && errors.quantity} labelText="How many do you want:">
            <NumberField
              id="quantity"
              name="quantity"
              max="10"
              positive
            />
          </Field>
        </section>

        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```
