import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import ListView from './ListView';

ReactDOM.render(<ListView />, document.getElementById('root'));

serviceWorker.unregister();
