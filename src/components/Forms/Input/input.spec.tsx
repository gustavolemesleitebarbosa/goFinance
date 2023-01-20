import React from 'react';
import { render } from '@testing-library/react-native';

import { Input } from '.';
import { ThemeProvider } from 'styled-components/native';

import theme from '../../../global/styles/theme';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>)
}

// describe é para suite de  testes cada it representa um teste da suíte
describe('Input Component', () => {
  it('must have specific border color when active', () => {
    // Método render para renderizar o componente, posso passar um teste Id para
    // o input a ser testado
    const { debug, getByTestId } = render(
      <Input
        testID="input-email"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCorrect={false}
        active
      />,
      { wrapper: Providers },
    );
    // funciona como console.log de testes
    debug()
    // recupero o elemento
    const inputElement = getByTestId("input-email");
    //teste através do expect
    expect(inputElement.props.style[0].borderColor).toEqual(
      theme.colors.attention,
    );
    //teste através do expect
    expect(inputElement.props.style[0].borderWidth).toEqual(3);
  });
});