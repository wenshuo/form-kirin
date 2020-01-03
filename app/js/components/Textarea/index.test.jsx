import React from 'react';
import { mount } from 'enzyme';

import TextareaField from '.';
import Form from '../Form';

describe('Textarea Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <Form>
        {
          () => (
            <TextareaField
              id="field"
              name="field"
              className="test"
            />
          )
        }
      </Form>
    );
  });

  it('render a textarea', () => {
    expect(el.find('textarea').exists()).to.be.true;
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });
});
