import React from 'react';

import Field from '../Field';

export default function Checkbox(props) {
  return (
    <label htmlFor={props.id}>
      <Field {...props} type="checkbox" />
      <span>{ props.label }</span>
    </label>
  );
}
