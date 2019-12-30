import React from 'react';
import PropTypes from 'prop-types';

import BasicField from '../BasicField';

export default function PasswordField({ showPassword, ...props }) {
  return(
    <BasicField {...props} type={showPassword ? 'text' : 'password'} />
  );
}

PasswordField.propTypes = {
  showPassword: PropTypes.bool
};

PasswordField.defaultProps = {
  showPassword: false
};
