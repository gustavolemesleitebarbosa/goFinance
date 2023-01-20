import React, { useState, useEffect } from 'react'
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native';

import { InputForm } from '../../components/Forms/InputForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CatergorySelectButton';
import uuid from 'react-native-uuid'
import { CategorySelect } from '../CategorySelect'
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';
import { useAuth } from '../../hooks/auth';

export function Register() {
  const { user} = useAuth()
  const dataKey = `@gofinances:transactions:${user.id}`
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const navigation = useNavigation();

  type FormData = {
    [name: string]: any;
  }
  const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe o valor númerico').positive('o valor não pode ser negativo').required('O valor é obrigatório')
  })

  function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }
    if (category.key === "category") {
      return Alert.alert('Selecione a categoria')
    }
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const data  = await AsyncStorage.getItem(dataKey);
      const currentData = data? JSON.parse(data): []
      const dataFormatted =[
        ...currentData,
        newTransaction
      ]
      
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria',
      })
      navigation.navigate('Listagem')
    }
    catch (errror) {
      Alert.alert("não foi possível cadastrar")
    }
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!))
    }
    loadData();
  }, [])


  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type='up'
                title='Income'
                onPress={() => handleTransactionsTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type='down'
                title='Outcome'
                onPress={() => handleTransactionsTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionsTypes>
            <CategorySelectButton
               testID='button-category'
              onPress={handleOpenSelectCategoryModal}
              title={category.name} />
          </Fields>
          <Button title='Enviar' onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal testID="modal-category" visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelctedCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}