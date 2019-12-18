import React from 'react';
import { Link } from 'react-router-dom';
import List from '../components/List';

export default function Home() {
  return (
    <List stacked>
      <List.Item>
        <Link to="/predefined-form-fields-example">1. Form created with predefined controls example</Link>
      </List.Item>
      <List.Item>
        <Link to="/custom-form-fields-example">2. Form created with custom controls example</Link>
      </List.Item>
      <List.Item>
        <Link to="/use-basic-form-control-example">3. Form created with basic controls example</Link>
      </List.Item>
    </List>
  );
}
