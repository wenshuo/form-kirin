import React from 'react';
import PropTypes from 'prop-types';

import { cx } from '../../helpers/utils';
import BasicField from '../BasicField';

export default function Radio(props) {
  return (
    <label htmlFor={props.id} className={cx('FormKirin-radio', props.className)}>
      <BasicField {...props} type="radio" />
      <span className="FormKirin-radio-label">{ props.label }</span>
    </label>
  );
}

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string
};
