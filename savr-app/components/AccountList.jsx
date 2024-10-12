import React, { useEffect, useState } from 'react'
import { View, FlatList, Text } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'
import { supabase } from '../utils/SupabaseConfig'
import AccountItem from './AccountItem'
import { useUser } from '@clerk/clerk-expo'

// Function to sync accounts between Akahu and Supabase
const syncAccounts = async (akahuAccounts) => {
  try {
    const { data: supabaseAccounts, error: supabaseError } = await supabase
      .from('accounts')
      .select('id, account_id')

    if (supabaseError) {
      console.error('Error fetching accounts from Supabase:', supabaseError)
      return
    }

    const akahuAccountIds = akahuAccounts.map((account) => account._id)
    const supabaseAccountIds = supabaseAccounts.map(
      (account) => account.account_id
    )

    const accountsToInsert = akahuAccounts.filter(
      (account) => !supabaseAccountIds.includes(account._id)
    )

    if (accountsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('accounts').insert(
        accountsToInsert.map((account) => ({
          account_id: account._id,
          email: email,
        }))
      )

      if (insertError) {
        console.error('Error inserting new accounts:', insertError)
      } else {
        console.log(`${accountsToInsert.length} new accounts inserted.`)
      }
    }

    const accountsToDelete = supabaseAccounts.filter(
      (account) => !akahuAccountIds.includes(account.account_id)
    )

    if (accountsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('accounts')
        .delete()
        .in(
          'account_id',
          accountsToDelete.map((account) => account.account_id)
        )

      if (deleteError) {
        console.error('Error deleting accounts:', deleteError)
      } else {
        console.log(`${accountsToDelete.length} accounts deleted.`)
      }
    }
  } catch (error) {
    console.error('Error syncing accounts:', error)
  }
}

const AccountList = () => {
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress
  const [isSyncing, setIsSyncing] = useState(false)

  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
    onSuccess: (data) => {
      setIsSyncing(true)
      syncAccounts(data.items).finally(() => setIsSyncing(false))
    },
  })

  if (isAccountsLoading || isSyncing) {
    return <Spinner visible={true} />
  }

  if (accountsError) {
    return (
      <View>
        <Text>Error loading data</Text>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={accountsData?.items}
        renderItem={({ item, index }) => (
          <AccountItem
            item={item}
            accountsData={accountsData}
            isLast={index === accountsData.items.length - 1}
          />
        )}
        keyExtractor={(item) => item._id.toString()}
        windowSize={5}
      />
    </View>
  )
}

export default AccountList
