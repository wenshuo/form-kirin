import React from 'react';
import PropTypes from 'prop-types';
import { omit } from '../../helpers/utils';

import FormControlWrapper from '../FormControlWrapper';
import { nonNativeProps } from '../../validation/validator';

const PROPS_TO_EXCLUDE = ['handleBlur', 'handleChange', 'validate',  'tagName', 'errorMessages'];

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

  return (
    <FormControlWrapper {...props}>
      {
        ({ value, handleChange, handleBlur, validationProps }) => {
          return (
            <Wrapper
              className={className}
              {...omit(props, [...PROPS_TO_EXCLUDE, ...nonNativeProps(validationProps)])}
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
