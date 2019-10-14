import {newE2EPage} from '@stencil/core/testing';

describe('bar-chart', () => {

  it('renders a bar chart', async () => {
    const page = await newE2EPage();
    await page.setContent('<ro-bar-chart></ro-bar-chart>');
  });
});
