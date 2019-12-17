import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import BasicForm from './BasicForm';
import HomePage from './Home';
import Page from './Page';
import CustomFormFieldExample from './CustomFormField';
import RenderPropExample from './RenderPropExample';

import './index.scss';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/basic-form">
          <Page>
            <BasicForm />
          </Page>
        </Route>
        <Route path="/custom-form-fields">
          <Page>
            <CustomFormFieldExample />
          </Page>
        </Route>
        <Route path="/render-prop-example">
          <Page>
            <RenderPropExample />
          </Page>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.querySelector('#appRoot'));
