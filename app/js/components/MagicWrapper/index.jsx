import React from 'react';
import PropTypes from 'prop-types';

import FormContext from '../../contexts/form';

export default function MagicWrapper({ children }) {
  if (typeof children !== 'function') {
    throw new Error('children of MagicWrapper must be function.');
  }

  return (
    <FormContext.Consumer>
      {
        context => children(context)
      }
    </FormContext.Consumer>
  );
}

MagicWrapper.propTypes = {
  children: PropTypes.func
};
