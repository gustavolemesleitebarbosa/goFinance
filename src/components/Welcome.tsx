import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Dashboard } from '../screens/Dashboard'

interface Props{
  title: string
}

const Welcome = ({title}: Props) => {
  return <Dashboard />
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center'
  }
})