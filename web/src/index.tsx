import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render( // Quero que vc renderize o meu APP dentro do meu div Root
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
