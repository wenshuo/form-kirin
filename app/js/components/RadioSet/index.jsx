import React, { Children } from 'react';
import PropTypes from 'prop-types';

import List from '../List';

export default function RadioSet({ children, stacked }) {
  return (
    <List>
      {
        Children.toArray(children).map((child, i) => (
          <List.Item key={i} stacked={stacked}>
            {child}
          </List.Item>
        ))
      }
    </List>
  );
}

RadioSet.propTypes = {
  children: PropTypes.node,
  stacked: PropTypes.bool
};
