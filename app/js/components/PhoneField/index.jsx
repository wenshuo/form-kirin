import React from 'react';

import BasicField from '../BasicField';

export default function PhoneField(props) {
  return(
    <BasicField {...props} type="tel" />
  );
}
