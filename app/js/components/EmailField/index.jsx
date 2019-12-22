import React from 'react';

import BasicField from '../BasicField';

function validate(fieldValue) {
  if (fieldValue) {
    return /^.+@.+\..+$/.test(fieldValue) ? '' : `${fieldValue} is not a valid email address.`;
  }

  return '';
}

export default function EmailField(props) {
  return(
    <BasicField validate={validate} {...props} type="email" />
  );
}
