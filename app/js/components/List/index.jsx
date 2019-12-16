import React, { Children } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';

function Item({ children }) {
  return (
    <li className={styles.item}>{children}</li>
  );
}

export default function List({ children, stacked }) {
  return (
    <ul className={cx(styles.container, { [styles.stacked]: stacked })}>
      {children}
    </ul>
  );
}

List.Item = Item;
