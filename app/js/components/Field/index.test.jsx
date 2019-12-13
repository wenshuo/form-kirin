import React from 'react';
import { mount } from 'enzyme';
import Input from '.';

describe('Input', () => {
  it('render input', () => {
    const el = mount(<Input name="test" id="test" />);

    expect(el.find('input').props().name).to.eql('test');
  });

  it('render id', () => {
    const el = mount(<Input name="test" id="test" />);

    expect(el.find('input').props().id).to.eql('test');
  })
});
