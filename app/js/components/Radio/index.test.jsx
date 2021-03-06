import React from 'react';
import { mount } from 'enzyme';
import Radio from '.';
import FormKirin from '../FormKirin';

describe('Radio Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <FormKirin>
        {
          () => (
            <Radio
              id="field"
              name="field"
              className="test"
              label="apple"
              value="apple"
            />
          )
        }
      </FormKirin>
    );
  });

  it('show label', () => {
    expect(el.text()).to.include('apple');
  });

  it('render label tag', () => {
    expect(el.find('label').exists()).to.be.true;
  });

  it('render a radio', () => {
    expect(el.find('input[type="radio"]').exists()).to.be.true;
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });

  it('add id to label for attribute', () => {
    expect(el.find('label').prop('htmlFor')).to.eql('field');
  });
});
