import React from 'react';
import { Link } from 'react-router-dom';
import List from '../components/List';

export default function Home() {
  return (
    <List stacked>
      <List.Item>
        <Link to="/basic-form">Basic Form</Link>
      </List.Item>
      <List.Item>
        <Link to="/custom-form-fields"  >Custom Form Field</Link>
      </List.Item>
    </List>
  );
}
