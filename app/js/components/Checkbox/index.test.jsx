import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '.';
import FormKirin from '../FormKirin';

describe('Checkbox Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <FormKirin>
        {
          () => (
            <Checkbox
              id="field"
              name="field"
              className="test"
              label="apple"
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

  it('render a checkbox', () => {
    expect(el.find('input[type="checkbox"]').exists()).to.be.true;
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });

  it('add id to label for attribute', () => {
    expect(el.find('label').prop('htmlFor')).to.eql('field');
  });
});
