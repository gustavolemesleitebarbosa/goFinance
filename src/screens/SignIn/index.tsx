import React, { useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'
import AppleSvg from '../../assets/apple.svg'
import GooggleSvg from '../../assets/google.svg'


import LogoSvg from '../../assets/logo.svg'

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

import { SignInSocialButton } from '../../components/SignInSocialButton'
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useAuth } from '../../hooks/auth';


export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple } = useAuth()
  const theme = useTheme()

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true)
      await signInWithGoogle();
    }
    catch (error) {
      Alert.alert('Não foi possível conectar a conta google')
    }
    finally {
      setIsLoading(false)
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true)
      return await signInWithApple();
    }
    catch (error) {
      Alert.alert('Não foi possível conectar a conta google')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas{'\n'} finanças de uma forma simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login
          com {'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title='Entrar com Google'
            svg={GooggleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' &&
            <SignInSocialButton
              title='Entrar com Apple'
              svg={AppleSvg}
              onPress={() => handleSignInWithApple()}
            />
          }
        </FooterWrapper>
        {
          isLoading &&
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />}
      </Footer>
    </Container>
  )
}