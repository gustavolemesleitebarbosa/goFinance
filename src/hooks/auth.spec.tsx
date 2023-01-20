import { renderHook, act } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { AuthProvider, useAuth } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


// To test login

/* Abre a tela para autenticar
[] 1- abre a tela para user autenticar;
[] 2- retorna type e params;
[] 3- Fetch de dados na conta google
*/



fetchMock.enableMocks();
// mock lib functionality in this case expo-auth-session
jest.mock('expo-auth-session', () => ({
  // mocking function from expo auth-session (startAsync is a function from the mocked lib startAsync)
  startAsync: () => ({
    // mocking return
    type: 'success',
    params: { access_token: 'token' },
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe('Auth Hook', () => {
  it('should be able to sign in with Google account existing', async () => {
    // mock de fetch
    fetchMock.mockResponseOnce(
      // mock da resposta
      JSON.stringify({
        id: 'any_id',
        email: 'any@gmail.com',
        name: 'gustavo',
        photo: 'any_photo.png',
      }),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      result.current.signInWithGoogle();
    });

    console.log('USERR PROFILE =>', result.current.user);

    expect(result.current.user.email).toBe('any@gmail.com');
  });

  it('should be error sign in with incorrect Google parameters', async () => {

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    try {
      await act(async () => {
        result.current.signInWithGoogle();
      });
    }
    catch {
      expect(result.current.user).toEqual({})
    }

  });

}
);