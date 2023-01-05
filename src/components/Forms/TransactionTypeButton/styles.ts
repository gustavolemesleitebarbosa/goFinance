import  styled,{css} from 'styled-components/native'
import { RectButton} from 'react-native-gesture-handler'
import  {Feather} from  '@expo/vector-icons'
import theme from '../../../global/styles/theme';
import { RFValue } from 'react-native-responsive-fontsize';

interface IconsProps {
  type: 'up'|'down';
}

interface ContainerProps {
  isActive: Boolean;
  type: 'up'|'down';
}

export const Container = styled.View<ContainerProps>`
width: 48%;
border-width : ${({isActive})=> isActive?0 :1.5}px;
border-style : solid;
border-color: ${({theme})=> theme.colors.text};
border-radius: 5px;
${({isActive, type})=> isActive && type === 'up'&& css`
background-color: ${({theme})=> theme.colors.success_light};
`}
${({isActive, type})=> isActive && type === 'down'&& css`
background-color: ${({theme})=> theme.colors.attention_light};
`}
`;

export const Button = styled(RectButton)`
flex-direction: row;
align-items: center;
justify-content: center;
padding:16px;
`

export const Icon = styled(Feather)<IconsProps>`
font-size: ${RFValue(24)}px;
margin-right: 12px;
color: ${({theme, type})=> type === 'up'? theme.colors.success: theme.colors.attention};
`;

export const Title = styled.Text`
font-family: ${({})=> theme.fonts.regular};
font-size: ${RFValue(14)}px;
`;