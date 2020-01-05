import React, { Component } from 'react';
import PasswordField from '.';
import FormKirin from '../FormKirin';

export default { title: 'PasswordField' };

class ShowPasswordExample extends Component {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    return (
      <FormKirin>
        {
          () => (
            <form>
              <PasswordField
                id="pw"
                name="pw"
                showPassword={this.state.showPassword}
              />
              <button type="button" onClick={this.toggle}>{this.state.showPassword ? 'hide' : 'show'}</button>
            </form>
          )
        }
      </FormKirin>
    );
  }
}

export const ShowPassword = () => <ShowPasswordExample />;
