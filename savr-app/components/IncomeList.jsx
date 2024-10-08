import { View, FlatList, Text } from 'react-native'
import React from 'react'
import IncomeItem from './IncomeItem'

const IncomeList = ({ incomeList }) => {
  return (
    <FlatList
      data={incomeList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <IncomeItem
          income={item.income}
          category={item.category}
        />
      )}
    />
  )
}

export default IncomeList
