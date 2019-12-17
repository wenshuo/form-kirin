import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import MagicWrapper from '../../components/MagicWrapper';

export default function CustomTextInput(props) {
  const fieldProps = omit(props, ['validate', 'label', 'toValue', 'fromValue']);

  return (
    <MagicWrapper {...props}>
      {
        ({ rawValue, handleBlur, handleChange, error, touched }) => (
          <div>
            <label htmlFor={props.id}>{props.label}</label>
            <input type="text" {...fieldProps} onChange={handleChange} onBlur={handleBlur} value={rawValue || ''} />
            {
              touched && error && <div className="error">{error}</div>
            }
          </div>
        )
      }
    </MagicWrapper>
  );
}

CustomTextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
