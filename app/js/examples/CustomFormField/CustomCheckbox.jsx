import React from 'react';
import PropTypes from 'prop-types';

import MagicWrapper from '../../components/MagicWrapper';
import omit from 'lodash/omit';

export default function CustomCheckbox(props) {
  const fieldProps = omit(props, ['validate', 'label']);

  return (
    <MagicWrapper {...props}>
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
    </MagicWrapper>
  );
}

CustomCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
