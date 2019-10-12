import {newE2EPage} from '@stencil/core/testing';

describe('my-component', () => {

  it('renders combobox', async () => {
    const page = await newE2EPage();
    await page.setContent('<ro-multi-combobox></ro-multi-combobox>');

    const component = await page.find('ro-multi-combobox');
    const inputEl = await page.find('ro-multi-combobox >>> input');
    const buttonEl = await page.find('ro-multi-combobox >>> button');

    component.setProperty('items', ['AAA', 'ABC', 'BBB']);
    await page.waitForChanges();

    await buttonEl.click();
    const ulEl = await page.find('ro-multi-combobox >>> .dropdown-menu >>> ul');
    const liEls = await ulEl.findAll('li');
    expect(liEls.map(li => li.textContent)).toEqual(['Select all', 'AAA', 'ABC', 'BBB']);

    await liEls[1].click();
    await liEls[3].click();

    expect(liEls[0]).not.toHaveClass('selected');
    expect(liEls[1]).toHaveClass('selected');
    expect(liEls[2]).not.toHaveClass('selected');
    expect(liEls[3]).toHaveClass('selected');
    expect(await inputEl.getProperty('value')).toEqual('AAA,BBB');

    await liEls[1].click();
    expect(liEls[1]).not.toHaveClass('selected');
    expect(await inputEl.getProperty('value')).toEqual('BBB');
  });
});
