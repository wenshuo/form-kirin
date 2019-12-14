import React, { Children } from 'react';
import Radio from '../Radio';
import List from '../List';

import styles from './index.module.scss';

export default function RadioSet({ children }) {
  return (
    <List>
      {
        Children.toArray(children).map((child, i) => (
          <List.Item key={i}>
            {child}
          </List.Item>
        ))
      }
    </List>
  );
}
