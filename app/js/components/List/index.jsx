import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './index.module.scss';

function Item({ children }) {
  return (
    <li className={styles.item}>{children}</li>
  );
}

Item.propTypes = {
  children: PropTypes.node
};

export default function List({ children, stacked }) {
  return (
    <ul className={cx(styles.container, { [styles.stacked]: stacked })}>
      {children}
    </ul>
  );
}

List.propTypes = {
  children: PropTypes.node,
  stacked: PropTypes.bool
};

List.Item = Item;
