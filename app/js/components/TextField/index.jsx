import React from 'react';

import BasicField from '../BasicField';

export default function TextField(props) {
  return(
    <BasicField {...props} type="text" />
  );
}
