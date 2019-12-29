import React from 'react';
import { mount } from 'enzyme';
import BasicField from '.';
import Form from '../Form';

describe('BasicField', () => {
  describe('create wrapper', () => {
    it('input element as default', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
              />
            )
          }
        </Form>
      );
      expect(el.find('input').exists()).to.be.true;
    });

    it('input element', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="input"
              />
            )
          }
        </Form>
      );
      expect(el.find('input').exists()).to.be.true;
    });

    it('textarea element', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="textarea"
              />
            )
          }
        </Form>
      );
      expect(el.find('textarea').exists()).to.be.true;
    });

    it('input element', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="select"
              />
            )
          }
        </Form>
      );
      expect(el.find('select').exists()).to.be.true;
    });
  });

  describe('value prop', () => {
    it('text input', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="input"
                type="text"
              />
            )
          }
        </Form>
      );

      el.setState({ values: { field: 'hello' }});
      expect(el.find('input').prop('value')).to.eql('hello');
    });

    it('textarea', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="textarea"
              />
            )
          }
        </Form>
      );

      el.setState({ values: { field: 'hello' }});
      expect(el.find('textarea').prop('value')).to.eql('hello');
    });

    it('checkbox', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="input"
                type="checkbox"
              />
            )
          }
        </Form>
      );

      el.setState({ values: { field: true }});
      expect(el.find('input').prop('checked')).to.be.true;
    });

    it('radio', () => {
      const el = mount(
        <Form>
          {
            () => (
              <BasicField
                id="field"
                name="field"
                tagName="input"
                value="apple"
                type="radio"
              />
            )
          }
        </Form>
      );

      el.setState({ values: { field: 'apple' }});
      expect(el.find('input').prop('checked')).to.be.true;
    });
  });

  it('pass handlers', () => {
    const el = mount(
      <Form>
        {
          () => (
            <BasicField
              id="field"
              name="field"
            />
          )
        }
      </Form>
    );

    expect(el.find('input').props()).to.have.property('onChange');
    expect(el.find('input').props()).to.have.property('onBlur');
  });

  it('attach className to container', () => {
    const el = mount(
      <Form>
        {
          () => (
            <BasicField
              id="field"
              name="field"
              className="test"
              tagName="input"
            />
          )
        }
      </Form>
    );

    expect(el.find('input.test').exists()).to.be.true;
  });
});
