import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PredefinedFormFieldExample from './PredefinedFormField';
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
        <Route path="/predefined-form-fields-example">
          <Page>
            <PredefinedFormFieldExample />
          </Page>
        </Route>
        <Route path="/custom-form-fields-example">
          <Page>
            <CustomFormFieldExample />
          </Page>
        </Route>
        <Route path="/use-basic-form-control-example">
          <Page>
            <RenderPropExample />
          </Page>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.querySelector('#appRoot'));
