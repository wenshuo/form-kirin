import React from 'react';
import MagicWrapper from '../../components/MagicWrapper';
import omit from 'lodash/omit';

export default function CustomTextInput(props) {
  const fieldProps = omit(props, ['validate', 'label', 'toValue', 'fromValue']);

  return (
    <MagicWrapper {...props}>
      {
        ({ value, rawValue, handleBlur, handleChange, error, touched }) => (
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
