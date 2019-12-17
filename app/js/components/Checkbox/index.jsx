import React from 'react';
import PropTypes from 'prop-types';

import BasicField from '../BasicField';
import styles from './index.module.scss';

export default function Checkbox(props) {
  return (
    <label htmlFor={props.id} className={styles.container}>
      <BasicField {...props} type="checkbox" />
      <span className={styles.label}>{ props.label }</span>
    </label>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string
};
