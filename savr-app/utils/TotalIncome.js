import { supabase } from './SupabaseConfig'

// Function to calculate total expected income from income table
export const calculateTotalExpectedIncome = async (email) => {
  try {
    const { data: incomeData, error: incomeError } = await supabase
      .from('income') // Income table
      .select('name, amount, period, category_id') // Select name, amount, and period
      .eq('created_by', email) // Filter by user's email

    if (incomeError) {
      console.error('Error fetching income data:', incomeError)
      return { totalIncome: 0, incomeByCategory: {} }
    }

    if (incomeData?.length === 0) {
      console.log('No income data found for the user.')
      return { totalIncome: 0, incomeByCategory: {} }
    }
    // Object to store total income per category
    const incomeByCategory = {}

    let totalExpectedIncome = 0

    // Loop through each income record to calculate monthly equivalent
    incomeData.forEach((income) => {
      let monthlyIncome = 0
      switch (income.period.toLowerCase()) {
        case 'weekly':
          monthlyIncome = income.amount * 4 // Convert weekly to monthly
          break
        case 'fortnight':
        case 'bi-weekly':
          monthlyIncome = income.amount * 2 // Convert bi-weekly to monthly
          break
        case 'monthly':
          monthlyIncome = income.amount // Already monthly
          break
        case 'yearly':
        case 'annually':
          monthlyIncome = income.amount / 12 // Convert yearly to monthly
          break
        case 'one off':
          monthlyIncome = income.amount // One off: add amount directly without any calculation
          break
        default:
          console.warn(`Unknown period "${income.period}" for income record.`)
          break
      }
      // Add to category's total income
      if (incomeByCategory[income.category_id]) {
        incomeByCategory[income.category_id] += monthlyIncome
      } else {
        incomeByCategory[income.category_id] = monthlyIncome
      }

      // Add the calculated monthly income to the total expected income
      totalExpectedIncome += monthlyIncome
    })

    return { totalExpectedIncome, incomeByCategory } // Return total expected income (monthly equivalent)
  } catch (error) {
    return { totalExpectedIncome: 0, incomeByCategory: {} }
  }
}
