import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './index.module.scss';

function Item({ children, className }) {
  return (
    <li className={cx(styles.item, className)}>{children}</li>
  );
}

Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default function List({ children, stacked, className }) {
  return (
    <ul className={cx(styles.container, className, { [styles.stacked]: stacked })}>
      {children}
    </ul>
  );
}

List.propTypes = {
  children: PropTypes.node,
  stacked: PropTypes.bool,
  className: PropTypes.string
};

List.Item = Item;
