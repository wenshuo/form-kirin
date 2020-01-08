import React from 'react';
import PropTypes from 'prop-types';

import FormControlWrapper from '../../components/FormControlWrapper';
import { omit } from '../../helpers/utils';

export default function CustomCheckbox(props) {
  const fieldProps = omit(props, ['validate', 'label']);

  return (
    <FormControlWrapper {...props}>
      {
        ({ fieldValue, handleBlur, handleChange, fieldError, fieldTouched }) => (
          <div>
            <input type="checkbox" {...fieldProps} onChange={handleChange} onBlur={handleBlur} checked={!!fieldValue} />
            <label htmlFor={props.id}>{props.label}</label>
            {
              fieldTouched && fieldError && <div className="error">{fieldError}</div>
            }
          </div>
        )
      }
    </FormControlWrapper>
  );
}

CustomCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
