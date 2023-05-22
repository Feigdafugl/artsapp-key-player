import React from 'react';
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

serviceWorkerRegistration.register({ onUpdate });
