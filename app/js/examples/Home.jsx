import React from 'react';
import { Link } from 'react-router-dom';
import List from '../components/List';

export default function Home() {
  return (
    <List>
      <List.Item>
        <Link to="/basic-form">Basic Form</Link>
      </List.Item>
    </List>
  );
}
