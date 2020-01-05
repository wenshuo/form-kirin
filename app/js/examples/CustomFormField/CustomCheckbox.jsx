import React from 'react';
import PropTypes from 'prop-types';

import FormControlWrapper from '../../components/FormControlWrapper';
import { omit } from '../../helpers/utils';

export default function CustomCheckbox(props) {
  const fieldProps = omit(props, ['validate', 'label']);

  return (
    <FormControlWrapper {...props}>
      {
        ({ value, handleBlur, handleChange, error, touched }) => (
          <div>
            <input type="checkbox" {...fieldProps} onChange={handleChange} onBlur={handleBlur} checked={!!value} />
            <label htmlFor={props.id}>{props.label}</label>
            {
              touched && error && <div className="error">{error}</div>
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
