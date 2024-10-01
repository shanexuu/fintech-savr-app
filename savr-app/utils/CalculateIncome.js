import { supabase } from './SupabaseConfig'
import dayjs from 'dayjs' // Import dayjs for date manipulation

// Function to calculate total actual income by category for the current month
export const calculateTotalActualIncome = async (email) => {
  try {
    // Get the start and end of the current month using dayjs
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD') // Start of the month
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD') // End of the month

    // Fetch the transaction data for the user, filtered by the current month's transactions
    const { data: transactionData, error: transactionError } = await supabase
      .from('transaction') // Transaction table
      .select('amount, category_id, created_at') // Fetch amount, category_id, and created_at fields
      .eq('user', email) // Filter by user's email
      .gte('created_at', startOfMonth) // Filter by transactions from the start of the current month
      .lte('created_at', endOfMonth) // Filter by transactions until the end of the current month

    // Handle any error while fetching data
    if (transactionError) {
      console.error('Error fetching transaction data:', transactionError)
      return { incomeByCategory: {} } // Return an empty object if there's an error
    }

    // If no transactions are found, return an empty income object
    if (!transactionData || transactionData.length === 0) {
      return { incomeByCategory: {} }
    }

    // Object to store total actual income by category for the current month
    const incomeByCategory = {}

    // Loop through each transaction and calculate total income per category
    transactionData.forEach((transaction) => {
      const categoryId = transaction.category_id
      const amount = parseFloat(transaction.amount)

      // Initialize the category in the object if it doesn't exist
      if (!incomeByCategory[categoryId]) {
        incomeByCategory[categoryId] = 0
      }

      // Add the transaction amount to the corresponding category
      incomeByCategory[categoryId] += amount
    })

    // Return the total actual income grouped by category for the current month
    return { incomeByCategory }
  } catch (error) {
    console.error('Unexpected error calculating total actual income:', error)
    return { incomeByCategory: {} } // Return an empty object in case of an error
  }
}
