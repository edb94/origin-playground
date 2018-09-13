import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Button } from '@blueprintjs/core'

import {
  Dialog,
  FormGroup,
  InputGroup,
  ControlGroup,
  HTMLSelect,
  Slider,
  Callout
} from '@blueprintjs/core'

import rnd from 'utils/rnd'
import withAccounts from '../hoc/withAccounts'
import query from '../queries/_listings'

import { CreateListingMutation } from '../../../mutations'

function showOGN(account) {
  if (!account.ogn) return ''
  return ` (${account.ogn.balance} OGN available, ${account.ogn.allowance} allowed)`
}

class CreateListing extends Component {
  constructor(props) {
    super()

    const seller = rnd(props.accounts.filter(a => a.role === 'Seller'))
    const arbitrator = rnd(props.accounts.filter(a => a.role === 'Arbitrator'))

    this.state = {
      title: 'Cool Bike',
      currencyId: 'ETH',
      price: '0.1',
      arbitrator: arbitrator ? arbitrator.id : '',
      from: seller ? seller.id : '',
      deposit: 50,
      category: 'For Sale'
    }
  }

  render() {
    const input = field => ({
      value: this.state[field],
      onChange: e => this.setState({ [field]: e.currentTarget.value })
    })
    return (
      <Mutation
        mutation={CreateListingMutation}
        update={this.onUpdate}
        onCompleted={this.props.onCompleted}
      >
        {(createListing, { loading, error }) => (
          <Dialog
            title="Create Listing"
            isOpen={this.props.isOpen}
            onClose={this.props.onCompleted}
          >
            <div className="bp3-dialog-body">
              {error && (
                <Callout
                  style={{ marginBottom: 15 }}
                  intent="danger"
                  icon="error"
                >
                  {error.toString()}
                </Callout>
              )}
              <FormGroup label="Seller">
                <HTMLSelect
                  {...input('from')}
                  options={this.props.accounts
                    .filter(a => a.role === 'Seller')
                    .map(a => ({
                      label: `${(a.name || a.id).substr(0, 24)} ${showOGN(a)}`,
                      value: a.id
                    }))}
                />
              </FormGroup>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, marginRight: 20 }}>
                  <FormGroup label="Category">
                    <HTMLSelect
                      fill={true}
                      {...input('category')}
                      options={[
                        'For Sale',
                        'Home Share',
                        'Car Share',
                        'Ticket'
                      ]}
                    />
                  </FormGroup>
                </div>
                <div style={{ flex: 2 }}>
                  <FormGroup label="Title">
                    <InputGroup {...input('title')} />
                  </FormGroup>
                </div>
              </div>

              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, marginRight: 20 }}>
                  <FormGroup label="Price">
                    <ControlGroup fill={true}>
                      <InputGroup {...input('price')} />
                      <HTMLSelect
                        style={{ minWidth: 65 }}
                        {...input('currencyId')}
                        options={['DAI', 'ETH', 'OGN']}
                      />
                    </ControlGroup>
                  </FormGroup>
                </div>
                <div style={{ flex: 1, marginRight: 20 }}>
                  <FormGroup label="Arbitrator">
                    <HTMLSelect
                      fill={true}
                      {...input('arbitrator')}
                      options={[
                        { label: 'Origin', value: web3.eth.defaultAccount }
                      ]}
                    />
                  </FormGroup>
                </div>
                <div style={{ flex: 1, padding: '0 5px' }}>
                  <FormGroup label="Deposit" labelInfo="(OGN)">
                    <Slider
                      fill={true}
                      min={0}
                      max={100}
                      stepSize={5}
                      labelStepSize={25}
                      onChange={deposit => this.setState({ deposit })}
                      value={this.state.deposit}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>
            <div
              className="bp3-dialog-footer"
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                text="Create Listing"
                intent="primary"
                loading={loading}
                onClick={() => createListing(this.getVars())}
              />
            </div>
          </Dialog>
        )}
      </Mutation>
    )
  }

  getVars() {
    return {
      variables: {
        deposit: String(this.state.deposit),
        arbitrator: this.state.arbitrator,
        from: this.state.from,
        data: {
          title: this.state.title,
          price: this.state.price,
          currencyId: this.state.currencyId,
          category: this.state.category
        }
      }
    }
  }

  onUpdate(cache, { data }) {
    const res = cache.readQuery({ query })
    cache.writeQuery({
      query,
      data: {
        marketplace: {
          ...res.marketplace,
          allListings: [data.createListing, ...res.marketplace.allListings]
        }
      }
    })
  }
}

export default withAccounts(CreateListing, 'marketplace')