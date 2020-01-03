import React from 'react';

import FormContext from '../../contexts/form';

export default function ResetButton(props) {
  return (
    <FormContext.Consumer>
      {
        ({ handleReset }) => (
          <input type="reset" onClick={handleReset} {...props} />
        )
      }
    </FormContext.Consumer>
  );
}
