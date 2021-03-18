import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import App from './App';
import configureStore from './store/configure-store';

const store = configureStore();

describe('App', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: () => {
        return {
          matches: false,
          addListener: () => {},
          removeListener: () => {},
        };
      },
    });

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => {
        return {
          getPropertyValue: () => {},
        };
      },
    });
  });

  test('renders without crashing', () => {
    const { baseElement } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(baseElement).toBeDefined();
  });
});
