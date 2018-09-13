import React, { Component } from 'react'
import { Query } from 'react-apollo'

import { Button } from '@blueprintjs/core'

import NodeAccounts from './_NodeAccounts'
import WalletAccounts from './_WalletAccounts'
import CreateWallet from './_CreateWallet'

import {
  CreateWalletMutation,
  DeployTokenMutation,
  SendFromNodeMutation,
  TransferTokenMutation,
  DeployMarketplaceMutation,
  UpdateTokenAllowanceMutation
} from '../../mutations'

import query from './_query'

async function populate() {
  const NodeAccounts = await web3.eth.getAccounts()
  const rnd = Math.floor(Math.random() * NodeAccounts.length)
  const NodeAccount = NodeAccounts[rnd]

  const Admin = (await gql.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Admin', name: 'Admin' }
  })).data.createWallet.id

  await gql.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Admin, from: NodeAccount, value: '0.5' }
  })

  await gql.resetStore()

  const OGN = (await gql.mutate({
    mutation: DeployTokenMutation,
    variables: { name: 'Origin Token', symbol: 'OGN', decimals: '18', supply: '1000000000' }
  })).data.deployToken

  const Marketplace = (await gql.mutate({
    mutation: DeployMarketplaceMutation,
    variables: { token: OGN }
  })).data.deployMarketplace

  await gql.resetStore()

  const Seller = (await gql.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Seller', name: 'Stan' }
  })).data.createWallet.id

  await gql.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Seller, from: NodeAccount, value: '0.5' }
  })

  await gql.resetStore()

  await gql.mutate({
    mutation: TransferTokenMutation,
    variables: { token: 'ogn', to: Seller, from: Admin, value: '500' }
  })

  await gql.mutate({
    mutation: UpdateTokenAllowanceMutation,
    variables: { token: 'ogn', to: Marketplace, from: Seller, value: '500' }
  })

  await gql.resetStore()

  const Buyer = (await gql.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Buyer', name: 'Nick' }
  })).data.createWallet.id

  await gql.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Buyer, from: NodeAccount, value: '0.5' }
  })

  await gql.resetStore()

  const Arbitrator = (await gql.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Arbitrator', name: 'Origin' }
  })).data.createWallet.id

  await gql.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Arbitrator, from: NodeAccount, value: '0.5' }
  })

  await gql.resetStore()

  const Affiliate = (await gql.mutate({
    mutation: CreateWalletMutation,
    variables: { role: 'Affiliate', name: 'Origin' }
  })).data.createWallet.id

  await gql.mutate({
    mutation: SendFromNodeMutation,
    variables: { to: Affiliate, from: NodeAccount, value: '0.1' }
  })

  await gql.resetStore()
}

class Accounts extends Component {
  render() {
    return (
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <p className="mt-3">Loading...</p>
          if (error) {
            console.log(query)
            return <p className="mt-3">Error :(</p>
          }
          if (!data || !data.web3) {
            return null
          }

          return (
            <>
              <CreateWallet />
              <WalletAccounts data={data.web3} />
              <NodeAccounts data={data.web3.nodeAccounts} />
              <Button
                style={{ marginTop: '1rem' }}
                intent="danger"
                onClick={async () => {
                  localStorage.clear()
                  web3.eth.accounts.wallet.clear()
                  await gql.cache.reset()
                  await gql.resetStore()
                }}
                text="Reset"
              />
              <Button
                style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
                intent="success"
                onClick={() => populate()}
                text="Populate"
              />
            </>
          )
        }}
      </Query>
    )
  }
}

export default Accounts