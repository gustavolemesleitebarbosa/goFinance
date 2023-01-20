import React from "react";
import {View, Text, TextInput, Button} from 'react-native'
import { Container } from "../SignIn/styles";

export function Profile(){
  return(
    <View>
      <Text testID="text-title">Perfil</Text>
      <TextInput
      testID="input-name"
      placeholder="Nome"
      autoCorrect ={false}
      value= "Rodrigo"
      />
    <TextInput      
      testID="input-surname"
      placeholder="Sobrenome"
      value= "Gonçalves"

      />
      <Button
      title="salvar"
      onPress={()=>{}}
      />

    </View>
  )
}