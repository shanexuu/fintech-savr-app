// Import the necessary libraries
import { serve } from 'https://deno.land/x/sift/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js' // Make sure to import the Supabase client

// Your Supabase environment
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

const scheduling = async () => {
  const appToken = Deno.env.get('APP_TOKEN') // Fetch app token from environment variables
  const userToken = Deno.env.get('USER_TOKEN') // Fetch user token from environment variables

  // Check if the tokens are defined
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

    // Check for a successful response
    if (!response.ok) {
      console.error('Failed to fetch transactions:', response.statusText)
      return
    }

    const data = await response.json()
    const transactions = data.items

    // Insert transactions into the Supabase database
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

      // Insert or ignore to avoid duplication
      const { error } = await supabase.from('all_transactions').upsert({
        akahu_id: _id,
        date: new Date(date), // Ensure the date is a valid JavaScript Date object
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
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

// Serve the function (if you're using Sift)
serve({
  '/scheduling': scheduling,
})
