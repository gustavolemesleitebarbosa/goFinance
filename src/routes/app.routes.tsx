import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from "react-native";
import {MaterialIcons} from '@expo/vector-icons'
import {useTheme} from 'styled-components'
const { Navigator, Screen} =createBottomTabNavigator()
import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";
import { Resume } from "../screens/Resume";


export function AppRoutes(){
  const theme = useTheme();
  return(
    <Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:theme.colors.secondary,
      tabBarInactiveTintColor: theme.colors.text,
      tabBarLabelPosition: 'beside-icon',
      tabBarStyle :{
          height: 88,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0
      }
    }}
    >
      <Screen name="Listagem" component={Dashboard} options ={{tabBarIcon:({size, color}) => <MaterialIcons size ={size} color ={color} name="format-list-bulleted" />}}/>
      <Screen name="Cadastrar" component={Register} options ={{tabBarIcon:({size, color}) => <MaterialIcons size ={size} color ={color} name="attach-money" />}}/>
      <Screen name="Resumo" component={Resume} options ={{tabBarIcon:({size, color}) => <MaterialIcons size ={size} color ={color} name="pie-chart" />}}/>
    </Navigator>
  )
}