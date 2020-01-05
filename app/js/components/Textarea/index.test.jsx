import React from 'react';
import { mount } from 'enzyme';

import TextareaField from '.';
import FormKirin from '../FormKirin';

describe('Textarea Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <FormKirin>
        {
          () => (
            <TextareaField
              id="field"
              name="field"
              className="test"
            />
          )
        }
      </FormKirin>
    );
  });

  it('render a textarea', () => {
    expect(el.find('textarea').exists()).to.be.true;
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });
});
