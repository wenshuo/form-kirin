import React from 'react';

import BasicField from '../BasicField';

function validate(fieldValue) {
  if (fieldValue) {
    return /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(fieldValue) ? '' : `${fieldValue} is not a valid phone number.`;
  }

  return '';
}

export default function PhoneField(props) {
  return(
    <BasicField validate={validate} {...props} type="tel" />
  );
}
