import React from 'react';
import PropTypes from 'prop-types';

import BasicField from '../BasicField';

function validate(fieldValue, fieldName) {
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
