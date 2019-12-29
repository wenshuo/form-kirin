import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import NumberField from '.';
import Form from '../Form';
import { simulateEvent } from '../../helpers/test';

describe('Number Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <Form validateOnChange>
        {
          () => (
            <NumberField
              id="field"
              name="field"
              className="test"
            />
          )
        }
      </Form>
    );
  });

  it('render a number input', () => {
    expect(el.find('input[type="number"]').exists()).to.be.true;
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });

  it('run default validation', (done) => {
    simulateEvent('change', el.find('input'), 'field', '11df');
    setTimeout(() => {
      expect(el.state().errors.field).to.eql('11df is not a number.');
      done();
    }, 0);
  });

  it('custom validation take precedency over default validation', () => {
    const validate = sinon.spy();

    el = mount(
      <Form validateOnChange>
        {
          () => (
            <NumberField
              id="field"
              name="field"
              className="test"
              validate={validate}
            />
          )
        }
      </Form>
    );
    simulateEvent('change', el.find('input'), 'field', '11');
    expect(validate.called).to.be.true;
  });
});
