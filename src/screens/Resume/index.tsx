import React, { useEffect, useState, useCallback } from 'react'
import { HistoryCard } from '../../components/HistoryCard'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Container,
   Header, 
   Title, 
   Content, 
   ChartContainer,
   MonthSelect,
   MonthSelectButton,
   MonthSelectIcon,
   Month,
   LoadContainer
} from './styles'
import { categories } from '../../utils/categories'
import { useFocusEffect } from '@react-navigation/native';
import { VictoryPie } from 'victory-native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import {addMonths, subMonths, format } from 'date-fns'
import { ptBR} from 'date-fns/locale'
import {useTheme } from 'styled-components'
import { RFValue } from 'react-native-responsive-fontsize'
import { useAuth } from '../../hooks/auth'

interface TransactionData {
  type: 'positive' | 'negative'
  name: string;
  amount: string;
  category: string
  date: string
}

interface CategoryData {
  key: string
  name: string;
  total: number;
  totalFormatted: string;
  color: string,
  percent: string,
}


export function Resume() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] =useState(new Date())
  const [totalByCategories, setTottalByCategories] = useState<CategoryData[]>([])
  const theme = useTheme()
  const {user} = useAuth()

  function handleChangeDate(action: 'next'| 'prev'){
    if(action ===  'next'){
      const newDate = addMonths(selectedDate,1)
      setSelectedDate(newDate)
    }
    else{
      const newDate = subMonths(selectedDate,1)
      setSelectedDate(newDate)
    }
  }

  async function loadData() {
    setIsLoading(true)
    const dataKey = `@gofinances:transactions:${user.id}`
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : []
    const expenses = responseFormatted.filter((expense: TransactionData) => expense.type === 'negative' &&
     new Date(expense.date).getMonth() === selectedDate.getMonth() &&
     new Date(expense.date).getFullYear() ===  selectedDate.getFullYear() )

    const expensesTotal = expenses.reduce((acc: number, expense: TransactionData) =>{
      return acc + Number(expense.amount)
    } , 0)

    const totalByCategory: CategoryData[] = []    
    categories.forEach(category => {
  
      let categorySum = 0;
  
      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount)
        }
      });

      if (categorySum > 0) {
        console.log('teste',category.name)
        const totalFormatted = categorySum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

        const percent = `${(categorySum/expensesTotal *100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          color: category.color,
          totalFormatted,
          percent
        }) 
      }
    }
    )
    setTottalByCategories(totalByCategory)
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>

      <Header>
        <Title> Resumo por categoria</Title>
      </Header>
      {isLoading ? <LoadContainer><ActivityIndicator 
      color={theme.colors.primary}
      size = "large"
      /></LoadContainer> :
      <Content 
      showsHorizontalScrollIndicator = {false} 
      contentContainerStyle ={{
        padding: 24,
        paddingBottom: useBottomTabBarHeight()
      }}
      >
  
        <MonthSelect>
          <MonthSelectButton onPress={()=> handleChangeDate('prev')}>
            <MonthSelectIcon name ="chevron-left"/>
          </ MonthSelectButton>
          <Month>{format(selectedDate,'MMMM, yyyy',{locale: ptBR})}</Month>
          <MonthSelectButton onPress={()=> handleChangeDate('next')}>
            <MonthSelectIcon name ="chevron-right"/>
          </ MonthSelectButton>

        </MonthSelect>

        <ChartContainer>
        <VictoryPie
        data ={totalByCategories}
        colorScale ={totalByCategories.map(category => category.color)}
        labelRadius ={50}
        style ={{
          labels :{
            fontSize: RFValue(18),
            fontWeight: 'bold',
            fill: theme.colors.shape
          }
        }}
        x="percent"
        y="total"
        />
        </ChartContainer>
     {
      totalByCategories.map(item=>(
        <HistoryCard
        key ={item.key}
        title ={item.name}
        amount ={item.totalFormatted}
        color = {item.color}
        />
      ))
     }
     </Content>
   }
    </Container>
  )
}