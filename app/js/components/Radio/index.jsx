import React from 'react';

import BasicField from '../BasicField';
import styles from './index.module.scss';

export default function Radio(props) {
  return (
    <label htmlFor={props.id} className={styles.container}>
      <BasicField {...props} type="radio" />
      <span className={styles.label}>{ props.label }</span>
    </label>
  );
}
