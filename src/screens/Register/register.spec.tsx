import React from "react";
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { ThemeProvider } from "styled-components/native";
import theme from '../../global/styles/theme'
import { Register } from '.'
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { renderHook } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/auth";
import { NavigationContainer } from "@react-navigation/native";


function Providers({ children }: { children: React.ReactNode }) {
  return (<NavigationContainer>
    <ThemeProvider theme={theme}><AuthProvider defaultUser={{
      id: 'c',
      name: 'b',
      email: 'a',
    }}>{children}</AuthProvider></ThemeProvider></NavigationContainer>)
}


describe('Register Screen', () => {
  jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

  it('should be able to open category modal when user clicks on button', () => {
    renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const { getByTestId } = render(
      <Register />,
      { wrapper: Providers }
    );
    const categoryModal = getByTestId('modal-category')
    const buttonCategory = getByTestId('button-category')
    fireEvent.press(buttonCategory)

    expect(categoryModal.props.visible).toBeTruthy();
  })

  it('should be able to open category modal when user clicks on button async mode', () => {
    renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const { getByTestId } = render(
      <Register />,
      { wrapper: Providers }
    );
    const categoryModal = getByTestId('modal-category')
    const buttonCategory = getByTestId('button-category')
    fireEvent.press(buttonCategory)

    waitFor(() =>{
      expect(categoryModal.props.visible).toBeTruthy();
    })
    
  })
})