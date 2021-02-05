import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import configureStore from "./store/configure-store";
import {Provider} from "react-redux";

const store = configureStore();


test('renders without crashing', () => {
    const {baseElement} = render(<Provider store={store}><App/></Provider>);
    expect(baseElement).toBeDefined();
});
