import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

export default function Field({ children, errorMessage, className }) {
  return (
    <div className={className}>
      {children}
      {
        errorMessage && (
          <p className={styles.errors}>{errorMessage}</p>
        )
      }
    </div>
  );
}

Field.propTypes = {
  children: PropTypes.node,
  errorMessage: PropTypes.string,
  className: PropTypes.string
};
