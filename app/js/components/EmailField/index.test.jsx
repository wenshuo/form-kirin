import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import EmailField from '.';
import Form from '../Form';
import { simulateEvent } from '../../helpers/test';

describe('Email Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <Form>
        {
          () => (
            <EmailField
              id="field"
              name="field"
              className="test"
            />
          )
        }
      </Form>
    );
  });

  it('render a email input', () => {
    expect(el.find('input[type="email"]').exists()).to.be.true;
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });

  it('run default validation', (done) => {
    el = mount(
      <Form validateOnChange>
        {
          () => (
            <EmailField
              id="field"
              name="field"
              className="test"
            />
          )
        }
      </Form>
    );
    simulateEvent('change', el.find('input'), 'field', 'example.com');
    setTimeout(() => {
      expect(el.state().errors.field).to.eql('example.com is not a valid email address.');
      done();
    }, 0);
  });

  it('custom validation take precedency over default validation', () => {
    const validate = sinon.spy();

    el = mount(
      <Form validateOnChange>
        {
          () => (
            <EmailField
              id="field"
              name="field"
              className="test"
              validate={validate}
            />
          )
        }
      </Form>
    );
    simulateEvent('change', el.find('input'), 'field', 'example.com');
    expect(validate.called).to.be.true;
  });
});
