import React from 'react';
import { mount } from 'enzyme';

import Field from '.';

describe('Field component:', () => {
  it('show error message', () => {
    const el = mount(
      <Field errorMessage="error">
        <p>test</p>
      </Field>
    );

    expect(el.text()).to.include('error');
  });

  it('attach className to container', () => {
    const el = mount(
      <Field errorMessage="error" className="test">
        <p>test</p>
      </Field>
    );

    expect(el.find('.test').exists()).to.be.true;
  });
});
