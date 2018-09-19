import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'

import {
  Button,
  NonIdealState,
  AnchorButton,
  Tooltip,
  Tag,
  Tabs,
  Tab
} from '@blueprintjs/core'

import withAccounts from './hoc/withAccounts'
import { MakeOffer, WithdrawListing, AddData, UpdateListing } from './mutations'
import Offers from './_Offers'
import EventsTable from './_EventsTable'
import AccountButton from '../accounts/AccountButton'

import query from './queries/_offers'

class Listing extends Component {
  state = {}
  render() {
    const listingId = this.props.match.params.listingID

    return (
      <Query query={query} variables={{ listingId }}>
        {({ loading, error, data }) => {
          if (loading) return <p className="mt-3">Loading...</p>
          if (error) {
            console.log(error)
            console.log(query.loc.source.body)
            return <p className="mt-3">Error :(</p>
          }

          const listing = data.marketplace.getListing
          const listingData = listing.ipfs || {}

          if (!listing) {
            return (
              <div style={{ maxWidth: 500, marginTop: 50 }}>
                <NonIdealState
                  icon="help"
                  title="Listing not found"
                  action={
                    <AnchorButton href="#/marketplace" icon="arrow-left">
                      Back to Listings
                    </AnchorButton>
                  }
                />
              </div>
            )
          }

          let selectedTabId = 'offers'
          if (this.props.location.pathname.match(/events$/)) {
            selectedTabId = 'events'
          }

          return (
            <>
              {this.renderBreadcrumbs(listing)}
              <h3 className="bp3-heading mt-3">{listingData.title}</h3>{' '}
              {this.renderDetail({ listingData, listing })}
              <Tabs
                selectedTabId={selectedTabId}
                onChange={(newTab, prevTab) => {
                  if (prevTab === newTab) {
                    return
                  }
                  if (newTab === 'offers') {
                    this.props.history.push(
                      `/marketplace/listings/${listingId}`
                    )
                  } else if (newTab === 'events') {
                    this.props.history.push(
                      `/marketplace/listings/${listingId}/events`
                    )
                  }
                }}
              >
                <Tab
                  id="offers"
                  title="Offers"
                  panel={
                    <Offers
                      listing={listing}
                      listingId={listingId}
                      offers={listing.offers}
                    />
                  }
                />
                <Tab
                  id="events"
                  title="Events"
                  panel={<EventsTable events={listing.events} />}
                />
              </Tabs>
              <MakeOffer
                {...this.state}
                listing={listing}
                isOpen={this.state.makeOffer}
                onCompleted={() => {
                  this.setState({ makeOffer: false })
                }}
              />
              <UpdateListing
                isOpen={this.state.updateListing}
                listing={listing}
                onCompleted={() => this.setState({ updateListing: false })}
              />
              <WithdrawListing
                isOpen={this.state.withdrawListing}
                listing={listing}
                onCompleted={() => this.setState({ withdrawListing: false })}
              />
              <AddData
                isOpen={this.state.addData}
                listing={listing}
                onCompleted={() => this.setState({ addData: false })}
              />
            </>
          )
        }}
      </Query>
    )
  }

  renderDetail({ listingData, listing }) {
    const accounts = this.props.accounts
    const sellerPresent = accounts.find(
      a => listing.seller && a.id === listing.seller.id
    )
    return (
      <div style={{ marginBottom: 10 }}>
        {`${listingData.category} by `}
        <AccountButton account={listing.seller} />
        <span style={{ marginRight: 10 }}>
          {` for ${listingData.price} ${listingData.currencyId ||
            ''}. Abitrator `}
          <AccountButton account={listing.arbitrator} />
          <span style={{ marginLeft: 10 }}>
            {`${listing.deposit || '0'} OGN`}
          </span>
        </span>
        {this.renderActions(sellerPresent, listing)}
        {listing.status === 'active' ? (
          <Tag style={{ marginLeft: 15 }} intent="success">
            Active
          </Tag>
        ) : (
          <Tag style={{ marginLeft: 15 }}>Withdrawn</Tag>
        )}
      </div>
    )
  }

  renderActions(sellerPresent = false, listing) {
    return (
      <>
        {listing.status !== 'active' ? null : (
          <>
            <Tooltip content="Update">
              <AnchorButton
                disabled={!sellerPresent}
                small={true}
                icon="edit"
                onClick={() => this.setState({ updateListing: true })}
              />
            </Tooltip>
            <Tooltip content="Delete">
              <AnchorButton
                intent="danger"
                icon="trash"
                small={true}
                disabled={!sellerPresent}
                style={{ marginLeft: 5 }}
                onClick={() => this.setState({ withdrawListing: true })}
              />
            </Tooltip>
          </>
        )}
        <Tooltip content="Add Data">
          <AnchorButton
            icon="comment"
            small={true}
            style={{ marginLeft: 5 }}
            onClick={() => this.setState({ addData: true })}
          />
        </Tooltip>
      </>
    )
  }

  renderBreadcrumbs(listing) {
    return (
      <ul className="bp3-breadcrumbs">
        <li>
          <Link className="bp3-breadcrumb" to="/marketplace">
            Listings
          </Link>
        </li>
        <li>
          <span className="bp3-breadcrumb bp3-breadcrumb-current">
            {`Listing #${listing.id}`}
          </span>
        </li>
        <li>
          <Button onClick={() => this.setState({ makeOffer: true })}>
            Make Offer
          </Button>
        </li>
      </ul>
    )
  }
}

export default withAccounts(Listing, 'marketplace')
