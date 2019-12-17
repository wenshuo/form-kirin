import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

export default function Field({ children, errorMessage }) {
  return (
    <div>
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
  errorMessage: PropTypes.string
};
