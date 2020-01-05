import React, { Children } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './index.module.scss';

export default function Field({ id, labelText, children, errorMessage, inline, className }) {
  const field = Children.only(children);

  return (
    <div className={className}>
      {
        labelText && (
          <label
            htmlFor={field.props.id || id}
            className={cx(styles.label, { [styles.label_inline]: inline })}
          >
            {labelText}
          </label>
        )
      }
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
  className: PropTypes.string,
  id: PropTypes.string,
  labelText: PropTypes.string,
  inline: PropTypes.bool
};
