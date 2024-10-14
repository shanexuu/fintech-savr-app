import { supabase } from './SupabaseConfig'
import dayjs from 'dayjs' // Import dayjs for date manipulation

// Function to calculate total actual expenses by category group for the current month
export const calculateTotalActualExpense = async (selectedCategoryGroup) => {
  try {
    // Get the start and end of the current month using dayjs
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD') // Start of the month
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD') // End of the month

    // Fetch the transaction data for the user, filtered by the current month's transactions
    const { data: transactionData, error: transactionError } = await supabase
      .from('all_transactions') // All transactions table
      .select('amount, id, category_group, date') // Fetch amount, category_group, and created_at fields
      .ilike('category_group', selectedCategoryGroup) // Filter by user's selected category group
      .gte('date', startOfMonth) // Filter by transactions from the start of the current month
      .lte('date', endOfMonth) // Filter by transactions until the end of the current month

    // Handle any error while fetching data
    if (transactionError) {
      console.error('Error fetching transaction data:', transactionError)
      return { expenseByCategoryGroup: {} } // Return an empty object if there's an error
    }

    // If no transactions are found, return an empty expense object
    if (!transactionData || transactionData.length === 0) {
      return { expenseByCategoryGroup: {} }
    }

    // Object to store total actual expense by category group for the current month
    const expenseByCategoryGroup = {}

    // Loop through each transaction and calculate total expense per category group
    transactionData.forEach((transaction) => {
      const categoryId = transaction.category_group
      const amount = parseFloat(transaction.amount)

      // Initialize the category group in the object if it doesn't exist
      if (!expenseByCategoryGroup[selectedCategoryGroup]) {
        expenseByCategoryGroup[selectedCategoryGroup] = 0
      }

      // Add the transaction amount to the corresponding category group
      expenseByCategoryGroup[selectedCategoryGroup] += amount
    })

    // Return the total actual expenses grouped by category group for the current month
    return { expenseByCategoryGroup }
  } catch (error) {
    console.error('Unexpected error calculating total actual expenses:', error)
    return { expenseByCategoryGroup: {} } // Return an empty object in case of an error
  }
}
