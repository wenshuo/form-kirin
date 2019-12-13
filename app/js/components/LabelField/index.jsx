import React, { Children } from 'react';
import cx from 'classnames';

import styles from './index.module.scss';

export default function LabelField({ text, inline, children }) {
  const field = Children.only(children);

  return (
    <div className={styles.container}>
      <label htmlFor={field?.props?.id} className={cx(styles.label, { [styles.label_inline]: inline })}>{text}</label>
      {children}
    </div>
  );
}
