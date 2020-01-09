## form-kirin
React form library that works in simple and configurable and extensible way.

### How to install
`npm install form-kirin`

or if you use `yarn`
`yarn add form-kirin`

### How to use
Pull in components `import { FormKirin, Form } from 'form-kirin';`

### Features
1. get values in and out the form
2. validations and error handling
  - field and form level
  - sync and async validation support
  - support validation props including html native props and ability to extend the set of props
3. resource binding
4. form submit and reset

### To see examples
There are a few examples written using react storybooks.
```
1. npm install
1. npm start
```

### Stylings
None of the built-in components come with stylings, but they add css class names to elements. Please read the source code to see what are the class names. Additionally each built-in component accept a className prop and attach it to the container element to support custom styling.

### How does it work ?
The FormKirin component keep all related state internally and pass those data to a render prop that renders the actual form.

### Get values into the form and get values out
There are a few different ways to get values into the form.
1. initialization by passing initialValues prop as object
1. bind resource to the form and define a get method
1. setValues and setFieldValue imperative methods, this is useful when creating custom form controls.

Example: initialValues and enableReinitialize
Initialize form using initialValues prop. When enableReinitialize is on, form-kirin will reinitialize form when initialValues changes.
Also it resets other form state such as errors, touched and etc. Optionally we can re-run validation when form is reinitialized by configuring the validateOnReinitialize prop to true.

```
import { FormKirin } from 'form-kirin';

const initialValues = {
  firstName: 'Jack',
  lastName: 'Sparrow'
};

<FormKirin initialValues={initialValues} enableReinitialize validateOnReinitialize>
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

Example: bind resource to form
Initialize form using values returned from resource.get method, supports sync and async methods.

```
import { FormKirin } from 'form-kirin';

const resource = {
  get(values, setters, props) {
    // Assume this is an async method
    // we have to return a promise that resolves the values to use.
    ...
  }
};
// No need to pass initialValues when using resource.

<FormKirin resource={resource}>
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

### get values out of the form
1. The FormKirin component will pass current values to the render prop so that the form controls can display latest form values.
2. onSubmit handler will receive current form values in the first argument.

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

### Reset form values
pass handleReset from the render prop to the html form component's onReset prop, it will reset the form values to current values of the initialValues prop and also it resets all other form data such as errors, touched, and etc and Optionally re-run validation when validateOnReset
is true.

Example: Reset form

```
import { FormKirin } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

function submitForm(values, { setSubmitting }) {
  ...
}

// This method is optional, Iif onReset is specified on FormKirin component, form-kirin will call this method after it resets the values.
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

Example: use native form controls and attach value, handleChange, and handleBlur from the render prop to the elements. It is verbose to create form in this way because we have to pass value, handleChange, handleBlur to each form control. Fortunately, form-kirin comes with form controls that perform the bindings for you.
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

Example: Use form controls from form-kirin. Under the hook, these build-in form controls use react context to read the data from the FormKirin component.

```
import {
  FormKirin,
  Form,
  Field,
  TextField,
  Checkbox,
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
    ({ values, touched, errors, isSubmitting }) => (
      <Form>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <TextField
              id="firstName"
              name="firstName"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <TextField
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
                <TextField
                  id="department"
                  name="department"
                />
              </Field>
            </section>
          )
        }

        <section className="section">
          <div>
            <Radio name="role" id="role1" value="manager" label="Manager" />
            <Radio name="role" id="role2" value="engineer" label="Engineer" />
            <Radio name="role" id="role3" value="QA" label="QA" />
          </div>
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

### Data validations
form-kirin supports form and field level, sync and async data validations in two different ways, functions and validation props.

form-kirin will run validations at different life cycle of a form, and we can control when to trigger validations by configuring props(validateOnBlur, validateOnChange and more, please see the api for more information) on FormKirin component. By default form-kirin will only run validations right before form submission.

Validation errors are passed to the render prop function, the errors object mimic the shape of the values object. Additionally, form-kirin keep track of the touched state for each form control. Displaying error message for form controls that are not touched seems not ideal, therefore we could make use of the touched state and only show error message when a field is touched.

Since form-kirin takes care of validations, we should add noValidate prop to the html form element to turn off browser validations. The built-in Form component will add noValidate prop for you. To reduce verbosity, we could use the built-in Form component since it also attach onSubmit and onReset handlers for you.

### isValidating state
Before running validations in form submission, form values reinitialization and form reset, form-kirin will set isValidating to true and set it back to false once validations finish. We could use this state to show proper UI to users.

Example: Synchronous form level and field level validations.
```
import { FormKirin, Field, TextField } from 'form-kirin';

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

// In this example, we want to run field level validations when a form control loses focus.
// Note that form-kirin always run field and form level validations before form submission, this behavior is not configurable at this moment.
// Also field level validation errors are merged with form level validation errors by concatenating the error messages.

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateForm={validateForm}
  validateOnBlur
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <TextField
              type="text"
              id="firstName"
              name="firstName"
              validate={validateName}
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <validateForm
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

Example: Asynchronous form level and field level validations.
```
import { FormKirin, Field, TextField } from 'form-kirin';

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
  // we could run server validations but for simplicity we just wrap it in a promise in this example.
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
  // we could run server validations but for simplicity we just wrap it in a promise in this example.
  return new Promise((resolve) => {
    resolve(value && value.length < 5 ? 'name must have at least 5 characters.' : '');
  });
}

// In this example, we want to run field level validations when a form control loses focus.
// Note that form-kirin always run field and form level validations before form submission, this behavior is not configurable at this moment.
// Also field level validation errors are merged with form level validation errors by concatenating the error messages.

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateForm={validateForm}
  validateOnBlur
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting }) => (
      <form onSubmit={handleSubmit} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <TextField
              id="firstName"
              name="firstName"
              validate={validateName}
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <TextField
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

Example: Field level validations for built-in form controls via props. Form-kirin comes with validations for native html attributes (required, min, max, maxlength, minlength, and pattern), and we can overwrite the error messages for these props by passing errorMessages prop to those built-in form controls. The errorMessages should be an object that contains key for a validation prop such as required, min and etc and the value should be the error message for the prop. By default, validation props are disabled, we can enable this feature by passing enableValidationProps to the FormKirin component.

```
import { FormKirin, Field, NumberField, EmailField, TextField } from 'form-kirin';

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
            <TextField
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
            <TextField
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

Example: Create new validation props by passing validationProps prop to the FormKirin component.
Note: New validations created in this way will only work for controls in the form with validationProps prop.
```
import { FormKirin, Field, NumberField, EmailField, TextField } from 'form-kirin';

const initialValues = {
  firstName: '',
  lastName: ''
};

// Add new validation props at the form level
// We can use the new validation prop in any built-in form controls within this form.
const validationProps = {
  positive({ value, fieldName }) {
    return value && value <= 0 ? `${fieldName} must be a positive number.` : '';
  }
};

function submitForm(values, { setSubmitting }) {
  ...
}

// Important, we have to set enableValidationProps to turn on validation props feature.
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
            <TextField
              id="firstName"
              name="firstName"
              minLength="5"
              required
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <TextField
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

Example: Add global validation props so that we can use those props in all forms created by form-kirin
```
import { FormKirin, Field, TextField, NumberField, EmailField, addValidations } from 'form-kirin';

const initialValues = {};

function submitForm(values) {
  ...
}

// here we add global validation props
addValidations({
  isEmailAddress({ value, fieldName }) {
    return !/^.+@.+\..+$/.test(value) && `${value || "''"} is not a valid email address.`;
  }
});

<FormKirin
  initialValues={initialValues}
  onSubmit={submitForm}
  validateOnBlur
  enableValidationProps
>
  {
    ({ values, touched, errors, handleSubmit, isSubmitting, handleReset }) => (
      <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
        <section className="section">
          <Field errorMessage={touched.firstName && errors.firstName} labelText="First Name:">
            <TextField
              id="firstName2"
              name="firstName"
              minLength="5"
              required
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
            <TextField
              id="lastName2"
              name="lastName"
              required
              minLength="5"
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.email && errors.email} labelText="Email:">
            <EmailField
              id="email2"
              name="email"
              isEmailAddress
              required
            />
          </Field>
        </section>

        <section className="section">
          <Field errorMessage={touched.quantity && errors.quantity} labelText="How many do you want:">
            <NumberField
              id="quantity2"
              name="quantity"
              positive
            />
          </Field>
        </section>

        <button type="reset" disabled={isSubmitting}>reset</button>
        <button type="submit" disabled={isSubmitting}>submit form</button>
      </form>
    )
  }
</FormKirin>
```

## API
### FormKirin component
This component keeps track of all form related state and passes the state down to its children via render prop function.

### FormKirin props
`initialValues:`
object that is used to initialized the form. Keys must be either the name or id of form controls, that says each form control must have either a name or id prop. If no initialValues is passed, an empty object is used instead.

`enableReinitialize:`
when true, reinitialize form values if initialValues changes. Default is false.

`validateOnReinitialize:`
When true, trigger validations when form is reinitialized. Default is false.

`validateOnBlur:`
When true, trigger field level validations when field loses focus. Default is false.

`validateOnChange:`
When true, trigger field level validations when field value changes. Default is false.

`validateOnReset:`
When true, trigger validations when form is reset. Default is false.

`validateOnMount:`
When true, trigger validations after form is mounted. Default is false.

`enableValidationProps:`
When true, enable validations bound to props. Default is false.
Built-in validations props are `required, min, max, minLength, maxLength, pattern`. We could also extend the set of validation props using the validationProps prop or the addValidations method for adding global validation props.

`validateForm:`
Function that define form level validations, it receive current form values, object of setter methods, and props passed the FormKirin component as arguments. Form level validations are triggered before form submission and optionally during form reinitialization and form reset. The function should return an object that mimics the shape of the form values if there are errors otherwise should return empty object.
`validateForm(values, setters, props)`

`validate:`
Object of functions, useful to define field validators for native html form controls. This object should mimic the shape of form values.
Each field validator function will receive current field value, field name, entire form values object and current set of props as argument and should either return error message string or nothing. Each key of this object should be name or id of form controls and value should be a function.
```
validate = {
  firstName(value, name, values) {
    ...
  },
  lastName(value, name, values) {
    ...
  }
};
```

`validationProps:`
Object of custom validators used as prop. Keys of this object can be used as props for form controls. Values should be functions that receive a context object which contains value, fieldName, errorMessages prop of the field control, and the value of the validation prop.
```
validationProps = {
  isEmail({ value, fieldName, isEmail, errorMessages }) {
    ...
  },
  isNumber({ value, fieldName, isNumber, errorMessages }) {
    ...
  }
};
```

`onSubmit:`
Handler function for form submission. It receives current form values, object of setter methods, and current set of props as arguments.
`onSubmit(values, setters, props)`

`onReset:`
Handler function form form reset. It receives current form values, object of setter methods, and current set of props as arguments.
`onReset(values, setters, props)`

`children:`
Render prop function that should render the form.

`resource:`
A object that contains methods for form actions such as initialization, form submission and etc.
When `resource.get` is defined, form-kirin will call this method for form initialization, and pass current form values, object of setter methods, and current set of props as arguments. This function can be sync or async, the sync version must return an object and the async version must return a promise that resolves the values. When `resource.update` is defined and no onSubmit is provided, form-kirin will call this function for form submission. The update method can be sync or async, the async version must return a promise. Other than these `get` and `update`, the resource can contain any other methods that you want to support your own needs. FormKirin will pass the same arguments as the `get` and `update` methods to these custom methods. The wrapped resource object will be passed to the render prop function.

### render prop arguments
FormKirin will pass all related form data and setter methods as an object to the render prop function, we could use es6 destructure syntax to get the data that needed for form creation.

`handleSubmit:`
Form submit handler that we should pass to the form element onSubmit prop.

`handleReset:`
Form reset handler that we should pass to the form element onReset prop.

`values:`
Form values. Keys are either name or id of the field controls.

`errors:`
Form validation errors. It mimics the shape of values.

`touched:`
The touched state. It mimics the shape of values.

`isSubmitting:`
Boolean value that indicates whether form submission finishes or not.

`isValidating:`
Boolean value that indicates whether form validation finished or not.

`submitCount:`
Number of form submission.

`resource:`
An wrapped resource object that each method will receive current form values, an object of setter method and current set of props as arguments.

`dirty:`
Readonly Boolean that indicates if any of the form values changes since initialization.

`isValid:`
Readonly Boolean that indicates if the form has any validation errors.

`handleBlur:`
Handler that should pass to a form control's onBlur to keep track of touched state.

`handleChange:`
Handler that should pass to a form control's onChange to keep track of field value.

`resetForm:`
Setter method that imperatively reset form to the initialValues or optionally to something different as specified in the first argument.
`resetForm(values, shouldRevalidate)`

`setFieldError:`
Setter method that imperatively set validation error for a form control.
`setFieldError(fieldName, errorMessage, shouldSetTouched)`

`setErrors:`
Setter method that imperatively set validation errors for all form controls.
`setErrors(errors, shouldSetTouched)`

`setFieldTouched:`
Setter method that imperatively set touched state for a form control.
`setFieldTouched(fieldName, touched)`

`setTouched:`
Setter method that imperatively set touched state for entire form.
`setTouched(touched)`

`setFieldValue:`
Setter method that imperatively set value for a form control.
`setFieldValue(fieldName, fieldValue, shouldValidate = false)`

`setValues:`
Setter method that imperatively set values for the entire form.
`setValues(values, shouldValidate)`

`setField:`
Setter method that set meta information for a form control. Internally form-kirin uses this method to register field level validation that specified in the validate prop on a built-in form control. Useful when we want to implement custom control that need to specify validation in similar way. Alternatively we can specify field level validations using validate prop at the FormKirin component, it works for both native html form control and built-in form controls from form-kirin.
```
const field = {
  name: '[name or id of a form control]',
  validate: '[validate function]'
};

setField(field);
```

`unsetField:`
Remove meta of a form control and also all related internal state.
`unsetField(fieldName)`

### Built-in Form Controls
`TextField`: render `input[type="text"]` field
  - `name:` required, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.

`<TextField name="firstName" {...otherProps} />`
otherProps will be forwarded to underlying input element.

`EmailField`: render `input[type="email"]` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.
  - `isEmail:` `boolean` `optional`, validation prop, will check if value is email.

`<EmailField name="myEmail" isEmail {...otherProps} />`
otherProps will be forwarded to underlying input element.

`PasswordField`: render `input[type="password"]` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.
  - `showPassword:` `boolean` `optional`, when true render a text input instead of password input. Default is false.

`<PasswordField name="secret" showPassword={false} {...otherProps} />`
otherProps will be forwarded to underlying input element.

`NumberField`: render `input[type="number"]` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.
  - `isNumber:` `boolean` `optional`, validation prop, will check if value is a number positive or negative.

`<NumberField name="amount" isNumber {...otherProps} />`
otherProps will be forwarded to underlying input element.

`Checkbox`: render `input[type="checkbox"]` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.
  - `id:` `string`, `required when label prop is present`, id of the control, will be used as label's htmlFor prop.
  - `label:` `string`, text for html label.

`<Checkbox name="isAdmin" id="isAdmin" label="isAdmin" {...otherProps} />`
otherProps will be forwarded to underlying input element.

`Radio`: render `input[type="radio"]` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.
  - `id:` `string`, `required`, id of the control, will be used as label's htmlFor prop.
  - `label:` `string`, `required`, text for html label.

`<Radio name="fruit" id="apple" label="apple" {...otherProps} />`
otherProps will be forwarded to underlying input element.

`Select`: render `select` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.
  - `multi:` `boolean`, `optional`, when true, allow user to select multiple options and set field value to array of selected values. Default is false.

```
<Select name="roles" id="roles" {...otherProps}>
  <option value="engineer">Engineer</option>
  <option value="manager">Manager</option>
  <option value="QA">QA</option>
</Select>
otherProps will be forwarded to underlying select element.
```

`Textarea`: render `textarea` field
  - `name:` `string`, `required`, name of the control, should be camelCase, form-kirin used name as key to keep track of various internal state.

`<Textarea name="bio" id="bio" {...otherProps} />`
otherProps will be forwarded to underlying select element.

`Field:`
utility component that wraps its children with label and error message.
  - `errorMessage:` `string`, `optional`, error message to show
  - `id:` `string`, `required when labelText is present`, pass to htmlFor prop.
  - `labelText:` `string or node`, `optional`, render html label when this prop is present
  - `inline:` `boolean`, `optional`, when true, render label inline with children content. Default is false.
  - `children:` `node`, form control to wrap.

```
<Field errorMessage={touched.lastName && errors.lastName} labelText="Last Name:">
  <Input
    type="text"
    id="lastName"
    name="lastName"
    validate={isRequired}
  />
</Field>

Note: When children has id, the label element will use that id as value for the label htmlFor prop.
```

`Form:`
It renders html form component and attach noValidate, onSubmit and onReset handlers and forward props to the underlying html form element. You don't have use this component for creating new forms but it helps reduce verbosity and save some typings.
  - `children:` `node`

```
<FormKirin>
  {
    () => (
      <Form>
        <TextField
          id="firstName"
          name="firstName"
        />

        <TextField
          id="lastName"
          name="lastName"
        />
      </Form>
    )
  }
</FormKirin>
```

### Create custom form control
The form-kirin library ships with MagicWrapper component that hooks into the FormKirin component and pass all related internal form state plus setter methods to the render prop function. The set of props passed are exactly the same as those pass in the FormKirin component render prop function.

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
