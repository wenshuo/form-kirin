import React, { Children } from 'react';
import PropTypes from 'prop-types';

import List from '../List';

export default function RadioSet({ children, stacked, className }) {
  return (
    <List className={className} stacked={stacked}>
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
  children: PropTypes.node,
  stacked: PropTypes.bool,
  className: PropTypes.string
};
