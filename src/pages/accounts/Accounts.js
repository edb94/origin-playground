import React, { Component } from 'react'
import { Query } from 'react-apollo'

import NodeAccounts from './_NodeAccounts'
import WalletAccounts from './_WalletAccounts'
import CreateWallet from './_CreateWallet'

import query from './_query'

class Accounts extends Component {
  render() {
    return (
      <Query query={query}>
        {({ loading, error, data }) => {
          if (loading) return <p className="mt-3">Loading...</p>
          if (error) {
            return <p className="mt-3">Error :(</p>
          }
          if (!data || !data.web3) { return null }

          return (
            <>
            <CreateWallet />
              <WalletAccounts data={data.web3} />
              <NodeAccounts data={data.web3.nodeAccounts} />
            </>
          )
        }}
      </Query>
    )
  }
}

export default Accounts
