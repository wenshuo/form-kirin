import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cx from 'classnames';

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
