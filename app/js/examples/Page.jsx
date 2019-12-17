import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Page(props) {
  return (
    <div>
      <header>
        <Link to="/">back</Link>
      </header>
      <main className="main">
        { props.children }
      </main>
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node
};
