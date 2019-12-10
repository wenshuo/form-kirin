### features
1. get values in and out of form
1. validations and errors handling
   - validation timing configuration, onchange, onblur, onsumbit
   - form level and field level validation
    form level validation should be a function that return an error object mimics the shape of the form values, triggered onsubmit
    field level validation will be triggered by onchange or onblur
    field level validation result is merged back to form level validation onsubmit
   - sync and async validation support

1. form submission and form reset
   - setSubmitting function to set submitting flag, useful for implementing loading spinner or disable submit button

1. form value formatting and parsing
