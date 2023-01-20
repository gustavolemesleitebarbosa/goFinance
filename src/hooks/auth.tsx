import React, { ReactNode, createContext, useContext, useState } from 'react'

import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';


const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env
const userStoragekey = '@gofinances:user'
interface AuthProviderProps {
  children: ReactNode;
  defaultUser: User
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User
  signInWithGoogle(): Promise<void>
  signInWithApple(): Promise<void>
  signOut(): Promise<void>,
  userStorageLoading: boolean
}


interface AuthorizationResponse {
  params: {
    access_token: string;
  }
  type: string
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children, defaultUser = {} as User }: AuthProviderProps) {
  const [user, setUser] = useState<User>(defaultUser)
  const[userStorageLoading, setUserStorageLoading] = useState(true)

  useEffect(()=>{
    async function loadUserStoragedDate() {
      const userStoraged = await AsyncStorage.getItem(userStoragekey);
      if(userStoraged){
        const userLogged = JSON.parse(userStoraged) as User
        setUser(userLogged)
      }
      setUserStorageLoading(false)
    }
    loadUserStoragedDate()
    },[])

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithApple, signOut, userStorageLoading }}>
      {children}
    </AuthContext.Provider>)

  async function signInWithGoogle() {
    try {

      const RESPONSE_TYPE = 'token';
      // use encodeURI
      const SCOPE = encodeURI('profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
      const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse
      console.log('tesing user',type)
      console.log('tesing user II',JSON.stringify(params))
      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();
        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture
        }
        setUser(userLogged)
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }
    }
    catch (error) {
      console.log('erro in this case', error)
      throw new Error()
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      if (credential && credential.fullName && credential.fullName.givenName) {
        const userLogged = {
          id: String(credential.user),
          email: String(credential.email),
          name: credential.fullName?.givenName,
          photo: `https://ui-avatars.com/api/?name=${credential.fullName?.givenName}&length=1`
        }
        setUser(userLogged)
        await AsyncStorage.setItem(userStoragekey, JSON.stringify(userLogged))
      }
    }
    catch (error) {
      throw new Error()
    }
  }

  async function signOut() {
    setUser({} as User)
    await AsyncStorage.removeItem(userStoragekey)
  }

}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }