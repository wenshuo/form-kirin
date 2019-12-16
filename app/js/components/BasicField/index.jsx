import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cx from 'classnames';

import MagicWrapper from '../MagicWrapper';
import styles from './index.module.scss';

function valueProp(value, type, valueFromProp) {
  let inputProps = {};

  if (type === 'checkbox') {
    inputProps = { checked: !!value };
  } else if (type === 'radio') {
    inputProps = { checked: value === valueFromProp };
  } else {
    inputProps = { value:  value || '' };
  }

  return inputProps;
}

export default function BasicField(props) {
  const { className, tagName: Wrapper, type } = props;
  const fieldProps = omit(props, ['handleBlur', 'handleChange', 'validate',  'tagName']);

  return (
    <MagicWrapper {...props}>
      {
        ({ value, handleChange, handleBlur }) => {
          return (
            <Wrapper
              className={cx(styles.input, className)}
              {...fieldProps}
              {...valueProp(value, type, props.value)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          );
        }
      }
    </MagicWrapper>
  );
}

BasicField.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string
};

BasicField.defaultProps = {
  tagName: 'input'
};
