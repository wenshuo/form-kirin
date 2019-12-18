import React from 'react';
import PropTypes from 'prop-types';

import BasicField from '../BasicField';

function toValue(value) {
  return Number(value);
}

function fromValue(value) {
  return String(value);
}

export default function NumberField(props) {
  return(
    <BasicField {...props} toValue={toValue} fromValue={fromValue} />
  );
}
