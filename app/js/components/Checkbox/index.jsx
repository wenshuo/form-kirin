import React from 'react';
import PropTypes from 'prop-types';
import { cx } from '../../helpers/utils';

import BasicField from '../BasicField';

export default function Checkbox(props) {
  if (!props.label) {
    return (<BasicField {...props} type="checkbox" />);
  }

  return (
    <label htmlFor={props.id} className={cx('FormKirin-checkbox', props.className)}>
      <BasicField {...props} type="checkbox" />
      <span className="FormKirin-checkbox-label">{ props.label }</span>
    </label>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string
};
