import React from 'react';
import PropTypes from 'prop-types';
import { cx } from '../../helpers/utils';

import BasicField from '../BasicField';
import styles from './index.module.scss';

export default function Checkbox(props) {
  if (!props.label) {
    return (<BasicField {...props} type="checkbox" />);
  }

  return (
    <label htmlFor={props.id} className={cx(styles.container, props.className)}>
      <BasicField {...props} type="checkbox" />
      <span className={styles.label}>{ props.label }</span>
    </label>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string
};
