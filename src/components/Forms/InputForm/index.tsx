import React from 'react'
import { TextInputProps } from 'react-native'
import { Input } from '../Input'
import { Container,Error } from './style'
import {Control, Controller} from 'react-hook-form'


interface Props extends TextInputProps {
  control: Control;
  name: string;
  error: any;
}

export function InputForm ({
  control,
  name,
  error,
  ...rest
}: Props) {
  return (
    <Container>
      <Controller
      control ={control}
      name ={name}
      render ={({ field: { onChange, value}}) =>(<Input
        onChangeText={onChange}
        value ={value}
        {...rest}/>)} 
      />
      {error &&<Error>{error}</Error>}
    </Container>
  )
}

