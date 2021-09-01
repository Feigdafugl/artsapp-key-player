import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const updateEvent = new CustomEvent(
  'updateready',
  { bubbles: true, cancelable: true, composed: false },
);

/**
 * Trigger update event
 */
const onUpdate = () => {
  document.getElementById('root').dispatchEvent(updateEvent);
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register({ onUpdate });
