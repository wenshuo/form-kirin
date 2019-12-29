import React from 'react';

import BasicField from '../BasicField';

// Regex for number(including negative, integer, floating number)
function validate(value) {
  console.log(value);
  if (value) {
    return /^-?\d*(\.\d+)?$/.test(value) ? '' : `${value} is not a number.`;
  }

  return '';
}

export default function NumberField(props) {
  return(
    <BasicField validate={validate} {...props}  type="number" />
  );
}
