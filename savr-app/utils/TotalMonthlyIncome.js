import { supabase } from './SupabaseConfig'
import dayjs from 'dayjs' // Import dayjs for date manipulation

// Function to calculate total actual income for the current month
export const calculateTotalActualIncome = async () => {
  try {
    // Get the start and end of the current month using dayjs
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD') // Start of the month
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD') // End of the month

    // Fetch the transaction data for the current month where category_group is not null
    const { data: transactionData, error: transactionError } = await supabase
      .from('all_transactions') // Transaction table
      .select('amount, id, date, category_group') // Fetch amount, category_group, and date fields
      .gte('date', startOfMonth) // Filter by transactions from the start of the current month
      .lte('date', endOfMonth) // Filter by transactions until the end of the current month
      .not('category_group', 'is', null) // Ensure category_group is not null

    // Handle any error while fetching data
    if (transactionError) {
      console.error('Error fetching transaction data:', transactionError)
      return { totalIncome: 0 } // Return 0 if there's an error
    }

    // Calculate the total income by summing up the amounts of all filtered transactions
    const totalIncome = transactionData.reduce((acc, transaction) => {
      return acc + parseFloat(transaction.amount)
    }, 0)

    // Return the total actual income for the current month
    return { totalIncome }
  } catch (error) {
    console.error('Unexpected error calculating total actual income:', error)
    return { totalIncome: 0 } // Return 0 in case of an error
  }
}
