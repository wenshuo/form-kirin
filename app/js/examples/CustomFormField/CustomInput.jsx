import React from 'react';
import PropTypes from 'prop-types';
import { omit } from '../../helpers/utils';

import FormControlWrapper from '../../components/FormControlWrapper';

export default function CustomTextInput(props) {
  const fieldProps = omit(props, ['validate', 'label']);

  return (
    <FormControlWrapper {...props}>
      {
        ({ fieldValue, handleBlur, handleChange, fieldError, fieldTouched }) => (
          <div>
            <label htmlFor={props.id}>{props.label}</label>
            <input type="text" {...fieldProps} onChange={handleChange} onBlur={handleBlur} value={fieldValue || ''} />
            {
              fieldTouched && fieldError && <div className="error">{fieldError}</div>
            }
          </div>
        )
      }
    </FormControlWrapper>
  );
}

CustomTextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
