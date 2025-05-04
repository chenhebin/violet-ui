import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from './index';

describe('<Form />', () => {
  it('render Form with dumi', () => {
    const msg = 'dumi';

    render(<Form title={msg} />);
    expect(screen.queryByText(msg)).toBeInTheDocument();
  });
});
