import React, { Children } from 'react';

import styles from './index.module.scss';

function Item({ children }) {
  return (
    <li className={styles.item}>{children}</li>
  );
}

export default function List({ children }) {
  return (
    <ul className={styles.container}>
      {children}
    </ul>
  );
}

List.Item = Item;
