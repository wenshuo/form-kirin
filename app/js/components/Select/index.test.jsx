import React from 'react';
import { mount } from 'enzyme';

import Select from '.';
import FormKirin from '../FormKirin';
import { simulateEvent } from '../../helpers/test';

describe('Select Component:', () => {
  let el;

  beforeEach(() => {
    el = mount(
      <FormKirin>
        {
          () => (
            <Select
              id="field"
              name="field"
              className="test"
            >
              <option value="apple">apple</option>
              <option value="pear">pear</option>
              <option value="banana">banana</option>
            </Select>
          )
        }
      </FormKirin>
    );
  });

  it('render a select', () => {
    expect(el.find('select').exists()).to.be.true;
  });

  it('render options', () => {
    expect(el.find('option').length).to.eql(3);
  });

  it('attach className to container', () => {
    expect(el.find('.test').exists()).to.be.true;
  });

  it('select an option', (done) => {
    simulateEvent('change', el.find('select'), 'field', 'banana');
    setTimeout(() => {
      expect(el.state('values').field).to.eql('banana');
      done();
    }, 0);
  });

  it('select multiple option', (done) => {
    el = mount(
      <FormKirin initialValues={{ field: [] }}>
        {
          () => (
            <Select
              id="field"
              name="field"
              className="test"
              multiple
            >
              <option value="apple">apple</option>
              <option value="pear">pear</option>
              <option value="banana">banana</option>
            </Select>
          )
        }
      </FormKirin>
    );

    simulateEvent('change', el.find('select'), 'field', ['banana', 'pear']);
    setTimeout(() => {
      expect(el.state('values').field).to.eql(['banana', 'pear']);
      done();
    }, 0);
  });
});
