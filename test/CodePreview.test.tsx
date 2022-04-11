import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CodePreview } from '../src';

describe('CodePreview', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const code = {};

    ReactDOM.render(<CodePreview code={code} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
