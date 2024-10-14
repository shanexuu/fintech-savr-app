import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Link, useRouter } from 'expo-router'
import {
  RoundBtn,
  CircularChart,
  IncomeList,
  Header,
  ExpenseList,
} from '../../components'
import { supabase } from '../../utils/SupabaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useUser } from '@clerk/clerk-expo'
import { icons } from '../../constants'
import { calculateTotalActualIncome } from '../../utils/CalculateIncome'
import { calculateTotalExpectedIncome } from '../../utils/TotalIncome'

const Budget = () => {
  const { user } = useUser()
  const router = useRouter()
  const email = user?.emailAddresses[0]?.emailAddress
  const navigation = useNavigation()
  const [incomeList, setIncomeList] = useState([])
  const [expenseList, setExpenseList] = useState([])
  const [loading, setLoading] = useState(false)

  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const totalIncome = 5000 // Example total income
  const totalExpenses = 3000
  const avatarPress = () => {
    navigation.navigate('(more)/settings')
  }

  useEffect(() => {
    getBudgetData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      getBudgetData() // Fetch the latest data when the screen is focused
    }, [])
  )

  const getBudgetData = async () => {
    setLoading(true)
    try {
      // Fetch income data
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('*')
        .eq('created_by', email)
      if (incomeError) throw incomeError

      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('*')
      if (categoryError) throw categoryError

      const currentIncome = await calculateTotalActualIncome(email)

      const incomeWithCategory = incomeData.map((income) => {
        const category = categoryData.find(
          (cat) => cat.id === income.category_id
        )
        return {
          income,
          category,
        }
      })

      setIncomeList(incomeWithCategory)

      // Fetch expense data
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense')
        .select('*')
        .eq('created_by', email)
      if (expenseError) throw expenseError

      const expenseWithCategory = expenseData.map((expense) => {
        const category = categoryData.find(
          (cat) => cat.id === expense.category_id
        )
        return {
          expense,
          category,
        }
      })

      setExpenseList(expenseWithCategory)
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addIncome = () => {
    navigation.navigate('(budget)/add-income', {
      onGoBack: () => getBudgetData(), // Trigger data fetch after navigation
    })
  }

  const addExpense = () => {
    navigation.navigate('(budget)/add-expense', {
      onGoBack: () => getBudgetData(), // Trigger data fetch after navigation
    })
  }

  useFocusEffect(
    useCallback(() => {
      getBudgetData()
    }, [])
  )
  const handleIncomeDataFetched = (incomeId, totalIncome, monthlyIncome) => {
    // Store or update the income data as needed
    setIncomeData((prevData) => [
      ...prevData.filter((data) => data.incomeId !== incomeId),
      { incomeId, totalIncome, monthlyIncome },
    ])
  }

  const handleExpenseDataFetched = (
    expenseId,
    totalExpense,
    monthlyExpense
  ) => {
    setExpenseData((prevData) => [
      ...prevData.filter((data) => data.expenseId !== expenseId),
      { expenseId, totalExpense, monthlyExpense },
    ])
  }
  // Aggregate income and expenses
  const totalMonthlyIncome = incomeData.reduce(
    (total, income) => total + (income.monthlyIncome || 0),
    0
  )

  const totalEarnedIncome = incomeData.reduce(
    (total, income) => total + (income.totalIncome || 0),
    0
  )

  const totalMonthlyExpenses = expenseData.reduce(
    (total, expense) => total + (expense.monthlyExpense || 0),
    0
  )

  const totalSpentExpenses = expenseData.reduce(
    (total, expense) => total + (expense.totalExpense || 0),
    0
  )

  const remainingBudget = Math.max(totalMonthlyIncome - totalMonthlyExpenses, 0)

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="bg-white h-full flex"
    >
      <View className="px-4">
        <Header
          headertext="Budget"
          icon={icons.Info}
          containerStyle="mb-8"
          avatarPress={avatarPress}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getBudgetData()}
            refreshing={loading}
          />
        }
      >
        <View className="h-full bg-white ">
          <View className="flex items-center mb-10 shadow-md px-4 rounded-3xl">
            <CircularChart
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          </View>
          <View className="p-4">
            <Text className="font-bold text-xl">Budget Summary</Text>

            {/* Display income summary */}
            <Text>Total Monthly Income: ${totalMonthlyIncome.toFixed(2)}</Text>
            <Text>Total Earned Income: ${totalEarnedIncome.toFixed(2)}</Text>

            {/* Display expense summary */}
            <Text>
              Total Monthly Expenses: ${totalMonthlyExpenses.toFixed(2)}
            </Text>
            <Text>Total Spent Expenses: ${totalSpentExpenses.toFixed(2)}</Text>

            {/* Display remaining budget */}
            <Text>Remaining Budget: ${remainingBudget.toFixed(2)}</Text>
          </View>

          <View>
            {/* Income Section */}
            <View className="flex flex-row justify-between items-center my-6 px-4">
              <Text className="font-psemibold text-xl text-primary">
                Income Budgets
              </Text>
              <TouchableOpacity onPress={addIncome}>
                <Text className="font-plight text-primary text-3xl">+</Text>
              </TouchableOpacity>
            </View>

            <IncomeList
              incomeList={incomeList}
              onIncomeDataFetched={handleIncomeDataFetched}
            />
          </View>

          <View>
            {/* Expense Section */}
            <View className="flex flex-row justify-between items-center my-6 px-4">
              <Text className="font-psemibold text-xl text-primary">
                Expense Budgets
              </Text>
              <TouchableOpacity onPress={addExpense}>
                <Text className="font-plight text-primary text-3xl">+</Text>
              </TouchableOpacity>
            </View>

            <ExpenseList
              expenseList={expenseList}
              onExpenseDataFetched={handleExpenseDataFetched}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Budget
