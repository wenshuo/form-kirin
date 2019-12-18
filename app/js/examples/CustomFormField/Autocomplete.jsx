import React, { Component } from 'react';
import MagicWrapper from '../../components/MagicWrapper';

import styles from './Autocomplete.module.scss';

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleBlur(event) {
    this.setState({ isOpen: false });
  }

  handleFocus() {
    this.setState({ isOpen: true });
  }

  handleClick(item, setValue) {
    this.setState({ isOpen: false });
    setValue(this.props.name, item.label);
  }

  render() {
    const { name, items } = this.props;

    return (
      <MagicWrapper>
        {
          ({ handleChange, values, setFieldValue }) => (
            <div>
              <input
                className={styles.control}
                type="text"
                name={name}
                onChange={handleChange}
                onFocus={this.handleFocus}
                value={values[name] || ''}
                autoComplete="off"
              />
              {
                this.state.isOpen && (
                  <ul className={styles.container} onBlur={this.handleBlur}>
                    {
                      items.map(item => (
                        <li
                          className={styles.item}
                          key={item.label}
                          onClick={() => this.handleClick(item, setFieldValue)}
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
