import React, { Component } from 'react';
import MagicWrapper from '../../components/MagicWrapper';

import styles from './MultiSelect.module.scss';

export default class MultiSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.hideDropdown = this.hideDropdown.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.hideDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdown);
  }

  hideDropdown(event) {
    const classes = event.target.getAttribute('class') || '';

    if (!classes.includes(styles.item) && !classes.includes(styles.control)) {
      this.setState({ isOpen: false });
    }
  }

  showDropdown() {
    this.setState({ isOpen: true });
  }

  handleClick(item, currentValue = '', setValue) {
    if (!currentValue.includes(item.label)) {
      this.setState({ isOpen: false });
      setValue(this.props.name, `${currentValue}${currentValue ? ',' : ''}${item.label}`);
    }
  }

  render() {
    const { name, items } = this.props;

    return (
      <MagicWrapper>
        {
          ({ handleChange, handleBlur, values, setFieldValue }) => (
            <div>
              <input
                className={styles.control}
                type="text"
                name={name}
                onChange={handleChange}
                onFocus={this.showDropdown}
                onBlur={handleBlur}
                value={values[name] || ''}
                autoComplete="off"
              />
              {
                this.state.isOpen && (
                  <ul className={styles.container}>
                    {
                      items.map(item => (
                        <li
                          className={styles.item}
                          key={item.label}
                          onClick={() => this.handleClick(item, values[name], setFieldValue)}
                        >
                          {item.label}
                        </li>
                      ))
                    }
                  </ul>
                )
              }
            </div>
          )
        }
      </MagicWrapper>
    );
  }
}
