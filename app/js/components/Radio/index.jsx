import React from 'react';

import Field from '../Field';

export default function Radio(props) {
  return (
    <label htmlFor={props.id}>
      <Field {...props} type="radio" />
      <span>{ props.label }</span>
    </label>
  );
}
