import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { cx } from '../../helpers/utils';

export default function Field({ id, labelText, children, errorMessage, inline, className }) {
  const field = Children.only(children);

  return (
    <div className={cx('FormKirin-field', className)}>
      {
        labelText && (
          <label
            htmlFor={field.props.id || id}
            className="FormKirin-field-label"
          >
            {labelText}
          </label>
        )
      }
      {!inline && <br />}
      {children}
      {
        errorMessage && (
          <p className="FormKirin-field-error">{errorMessage}</p>
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
