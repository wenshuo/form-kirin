import React from 'react';
import { mount } from 'enzyme';
import List from '.';

describe('List Component:', () => {
  it('attach className to container', () => {
    const el = mount(
      <List className="list">
        <List.Item className="list-item">apple</List.Item>
        <List.Item className="list-item">pear</List.Item>
      </List>
    );

    expect(el.find('.list').exists()).to.be.true;
    expect(el.find('li.list-item')).to.have.lengthOf(2);
  });

  it('stacked style', () => {
    const el = mount(
      <List className="list" stacked>
        <List.Item className="item">apple</List.Item>
        <List.Item className="item">pear</List.Item>
      </List>
    );

    expect(el.find('.index-module__stacked').exists()).to.be.true;
  });
});
