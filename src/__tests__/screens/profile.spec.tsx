import React from 'react'
import {render} from '@testing-library/react-native'

import { Profile } from '../../screens/Profile'
// describe is used to create a test suit (group related tests together.)
describe('Profile Screen test suit',()=>{
  it('should be correctly user input name placeholder',()=>{
    const {getByPlaceholderText} = render(<Profile/>)
    const inputName = getByPlaceholderText('Nome')
    
    expect(inputName.props.placeholder).toBeTruthy()
    // is  the same as
    expect(inputName).toBeTruthy()
    // since inputName was already retrieved by placeholder text
  })
  
  it(' should check if user data has been loaded',()=>{
    const {getByTestId} = render(<Profile/>)
  
    const  inputName = getByTestId('input-name')
    const  inputSurname = getByTestId('input-surname')
  
    expect(inputName.props.value).toEqual('Rodrigo')
    expect(inputSurname.props.value).toEqual('Gonçalves')
  
  })
  
  it(' should have a title renders correctly',()=>{
    const {getByTestId} = render(<Profile/>)
    const  textTitle = getByTestId('text-title')
    expect(textTitle.props.children).toContain('Perfil')
  })

})
