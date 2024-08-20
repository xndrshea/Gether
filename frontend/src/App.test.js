import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./components/TonConnectButton', () => () => <div>Mocked TonConnectButton</div>);
jest.mock('./components/Home', () => () => <div>Mocked Home</div>);
jest.mock('./components/ScrollButton', () => () => <div>Mocked ScrollButton</div>);

beforeAll(() => {
  window.scrollTo = jest.fn();
});

test('renders App component', () => {
  render(<App />);

  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();

  const tonConnectButton = screen.getByText('Mocked TonConnectButton');
  expect(tonConnectButton).toBeInTheDocument();

  const homeComponent = screen.getByText('Mocked Home');
  expect(homeComponent).toBeInTheDocument();

  const scrollButton = screen.getByText('Mocked ScrollButton');
  expect(scrollButton).toBeInTheDocument();
});