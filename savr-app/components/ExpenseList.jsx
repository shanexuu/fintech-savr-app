import { View, FlatList, Text } from 'react-native'
import React from 'react'
import ExpenseItem from './ExpenseItem'

const ExpenseList = ({ expenseList }) => {
  return (
    <FlatList
      data={expenseList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ExpenseItem
          expense={item.expense}
          category={item.category}
        />
      )}
    />
  )
}

export default ExpenseList
