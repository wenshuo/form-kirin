// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';

import MagicWrapper from '../MagicWrapper';
import ControlWrapper from './ControlWrapper';

export default function FormControlWrapper(props) {
  return (
    <MagicWrapper>
      {
        (contextValue) => (<ControlWrapper {...props} formContext={contextValue} />)
      }
    </MagicWrapper>
  );
}
