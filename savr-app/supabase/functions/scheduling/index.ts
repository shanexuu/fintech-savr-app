// Import the necessary libraries
import { serve } from 'https://deno.land/x/sift/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// Your Supabase environment
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

const scheduling = async () => {
  const appToken = Deno.env.get('APP_TOKEN')
  const userToken = Deno.env.get('USER_TOKEN')

  if (!appToken || !userToken) {
    console.error('Missing Akahu app or user token.')
    return
  }

  try {
    const response = await fetch('https://api.akahu.io/v1/transactions', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Akahu-Id': appToken,
        Authorization: `Bearer ${userToken}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch transactions:', response.statusText)
      return
    }

    const data = await response.json()
    const transactions = data.items

    for (const transaction of transactions) {
      const {
        _id,
        date,
        description,
        amount,
        balance,
        type,
        _account,
        merchant,
        category,
        meta,
      } = transaction

      // Check if the transaction with this akahu_id already exists
      const { data: existingTransaction, error: checkError } = await supabase
        .from('all_transactions')
        .select('akahu_id')
        .eq('akahu_id', _id)
        .single() // Fetch only one record

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116: No matching record found
        console.error(
          'Error checking for existing transaction:',
          checkError.message
        )
        continue
      }

      if (!existingTransaction) {
        // Insert the transaction if it doesn't exist
        const { error } = await supabase.from('all_transactions').insert({
          akahu_id: _id,
          date: new Date(date),
          description,
          amount,
          balance,
          type,
          account_id: _account,
          merchant_name: merchant?.name,
          merchant_nzbn: merchant?.nzbn,
          merchant_website: merchant?.website,
          category_name: category?.name,
          category_group: category?.groups?.personal_finance?.name,
          card_suffix: meta?.card_suffix,
          reference: meta?.reference,
          logo: meta?.logo,
        })

        if (error) {
          console.error('Error inserting transaction:', error.message)
        }
      } else {
        console.log(
          `Transaction with akahu_id: ${_id} already exists. Skipping.`
        )
      }
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

// Serve the function
serve({
  '/scheduling': scheduling,
})
