import { render } from '@testing-library/react';

import Database from './database';

describe('Database', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Database />);
    expect(baseElement).toBeTruthy();
  });
});
