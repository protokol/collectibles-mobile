import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import App from './App';
import configureStore from './store/configure-store';

const store = configureStore();

test('renders without crashing', () => {
  const { baseElement } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(baseElement).toBeDefined();
});
