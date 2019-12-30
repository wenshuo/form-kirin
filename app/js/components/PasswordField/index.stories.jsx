import React, { Component } from 'react';
import PasswordField from '.';
import Form from '../Form';

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
      <Form>
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
      </Form>
    );
  }
}

export const ShowPassword = () => <ShowPasswordExample />;
