import React from 'react';
import PropTypes from 'prop-types';

import FormContext from '../../contexts/form';

export default function Form(props) {
  return (
    <FormContext.Consumer>
      {
        ({ handleSubmit, handleReset }) => (
          <form {...props} onSubmit={handleSubmit} onReset={handleReset}>
            {props.children}
          </form>
        )
      }
    </FormContext.Consumer>
  );
}

Form.propTypes = {
  children: PropTypes.node
};
