import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import cx from 'classnames';

import FormControlWrapper from '../FormControlWrapper';

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
    <FormControlWrapper {...props}>
      {
        ({ value, handleChange, handleBlur }) => {
          return (
            <Wrapper
              className={className}
              {...fieldProps}
              {...valueProp(value, type, props.value)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          );
        }
      }
    </FormControlWrapper>
  );
}

BasicField.propTypes = {
  tagName: PropTypes.oneOf(['input', 'textarea', 'select']),
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

BasicField.defaultProps = {
  tagName: 'input'
};
