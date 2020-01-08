import React from 'react';
import FormKirin from '../FormKirin';
import { mount } from 'enzyme';
import Form from '.';

describe('Form Component', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <FormKirin>
        {
          ({ values, handleChange }) => (
            <Form name="test">
              <input type="text" name="firstName" id="firstName" value={values.firstName} onChange={handleChange} />
            </Form>
          )
        }
      </FormKirin>
    );
  });

  it('create a form tag', () => {
    expect(el.find('form').exists()).to.be.true;
  });

  it('forward props to form element', () => {
    expect(el.find('form').props()).to.have.property('name');
  });

  it('attach onSubmit and onReset', () => {
    expect(el.find('form').props()).to.have.property('onSubmit');
    expect(el.find('form').props()).to.have.property('onReset');
  });

  it('add noValidate', () => {
    expect(el.find('form').props()).to.have.property('noValidate');
  });
});
