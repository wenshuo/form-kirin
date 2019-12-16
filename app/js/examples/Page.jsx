import React from 'react';
import { Link } from 'react-router-dom';

export default function Page(props) {
  return (
    <div>
      <header>
        <Link to="/">back</Link>
      </header>
      <main>
        { props.children }
      </main>
    </div>
  );
}
