import React from 'react';

import BasicField from '../BasicField';

export default function EmailField(props) {
  return(
    <BasicField {...props} type="email" />
  );
}
