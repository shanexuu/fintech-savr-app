import { supabase } from './SupabaseConfig'

// Function to calculate total expected expense from expense table
export const calculateTotalExpectedExpense = async (email) => {
  try {
    const { data: expenseData, error: expenseError } = await supabase
      .from('expense') // expense table
      .select('name, amount, period, category_id') // Select name, amount, and period
      .eq('created_by', email) // Filter by user's email

    if (expenseError) {
      console.error('Error fetching expense data:', expenseError)
      return { totalExpense: 0, expenseByCategory: {} }
    }

    if (expenseData?.length === 0) {
      console.log('No expense data found for the user.')
      return { totalExpense: 0, expenseByCategory: {} }
    }
    // Object to store total expense per category
    const expenseByCategory = {}

    let totalExpectedExpense = 0

    // Loop through each expense record to calculate monthly equivalent
    expenseData.forEach((expense) => {
      let monthlyExpense = 0
      switch (expense.period.toLowerCase()) {
        case 'weekly':
          monthlyExpense = expense.amount * 4 // Convert weekly to monthly
          break
        case 'fortnight':
        case 'bi-weekly':
          monthlyExpense = expense.amount * 2 // Convert bi-weekly to monthly
          break
        case 'monthly':
          monthlyExpense = expense.amount // Already monthly
          break
        case 'yearly':
        case 'annually':
          monthlyExpense = expense.amount / 12 // Convert yearly to monthly
          break
        case 'one off':
          monthlyExpense = expense.amount // One off: add amount directly without any calculation
          break
        default:
          console.warn(`Unknown period "${expense.period}" for expense record.`)
          break
      }
      // Add to category's total expense
      if (expenseByCategory[expense.category_id]) {
        expenseByCategory[expense.category_id] += monthlyExpense
      } else {
        expenseByCategory[expense.category_id] = monthlyExpense
      }

      // Add the calculated monthly expense to the total expected expense
      totalExpectedExpense += monthlyExpense
    })

    return { totalExpectedExpense, expenseByCategory } // Return total expected expense (monthly equivalent)
  } catch (error) {
    return { totalExpectedExpense: 0, expenseByCategory: {} }
  }
}
