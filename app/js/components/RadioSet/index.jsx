import React, { Children } from 'react';
import PropTypes from 'prop-types';

import List from '../List';

export default function RadioSet({ children }) {
  return (
    <List>
      {
        Children.toArray(children).map((child, i) => (
          <List.Item key={i}>
            {child}
          </List.Item>
        ))
      }
    </List>
  );
}

RadioSet.propTypes = {
  children: PropTypes.node
};
