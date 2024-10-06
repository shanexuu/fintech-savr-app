import { supabase } from './SupabaseConfig'
import dayjs from 'dayjs' // Import dayjs for date manipulation

export const calculateMonthlyIncome = async (email) => {
  try {
    // Get the start and end of the current month using dayjs
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD') // Start of the month
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD') // End of the month

    // Fetch the transaction data for the user, filtered by the current month's transactions
    const { data: transactionData, error: transactionError } = await supabase
      .from('transaction') // Transaction table
      .select('amount, name, created_at') // Fetch amount, name, and created_at fields
      .eq('user', email) // Filter by user's email
      .eq('name', 'income') // Filter by transactions where the name is 'income'
      .gte('created_at', startOfMonth) // Filter transactions from the start of the current month
      .lte('created_at', endOfMonth) // Filter transactions until the end of the current month

    // Handle any error during the fetch
    if (transactionError) {
      console.error('Error fetching transaction data:', transactionError)
      return 0
    }

    // If no transactions are found, return 0
    if (!transactionData || transactionData.length === 0) {
      console.log('No income transactions found for the user this month.')
      return 0
    }

    // Calculate the total income by summing up the amounts
    const totalMonthlyIncome = transactionData.reduce((acc, transaction) => {
      return acc + parseFloat(transaction.amount)
    }, 0)

    // Return the calculated total monthly income
    return totalMonthlyIncome
    console.log('monthly income:' + `${totalMonthlyIncome}`)
  } catch (error) {
    console.error('Unexpected error calculating total monthly income:', error)
    return 0
  }
}
