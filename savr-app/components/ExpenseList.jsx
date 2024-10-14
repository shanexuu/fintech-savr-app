import { View, FlatList, Text } from 'react-native'
import React from 'react'
import ExpenseItem from './ExpenseItem'

const ExpenseList = ({ expenseList, onExpenseDataFetched }) => {
  return (
    <FlatList
      data={expenseList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ExpenseItem
          expense={item.expense}
          category={item.category}
          onExpenseDataFetched={onExpenseDataFetched}
        />
      )}
    />
  )
}

export default ExpenseList
