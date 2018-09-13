import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { AnchorButton, Tooltip, Tag, Icon } from '@blueprintjs/core'

import withAccounts from './hoc/withAccounts'

import AcceptOffer from './mutations/_AcceptOffer'
import FinalizeOffer from './mutations/_FinalizeOffer'
import WithdrawOffer from './mutations/_WithdrawOffer'
import AddFunds from './mutations/_AddFunds'
import AccountButton from '../accounts/AccountButton'

const Offers = ({ listing, offers, accounts }) => (
  <table className="bp3-html-table bp3-small mt-3">
    <thead>
      <tr>
        <th>ID</th>
        <th>Status</th>
        <th>Offer</th>
        <th>Buyer</th>
        <th>Commission</th>
        <th>Arbitrator</th>
        <th style={{ borderLeft: '1px solid rgba(16, 22, 26, 0.15)' }}>
          Buyer
        </th>
        <th>Seller</th>
        <th>Arbitrator</th>
        <th>Other</th>
      </tr>
    </thead>
    <tbody>
      {offers.map(a => (
        <OfferRow key={a.id} offer={a} listing={listing} accounts={accounts} />
      ))}
    </tbody>
  </table>
)

class OfferRow extends Component {
  state = {}

  render() {
    const { offer, listing, accounts } = this.props
    if (offer.status === 4 || offer.status === 0) {
      return this.renderInactiveRow()
    }
    const buyerPresent = accounts.find(
      a => offer.buyer && a.id === offer.buyer.id
    )
    const sellerPresent = accounts.find(
      a => listing.seller && a.id === listing.seller.id
    )
    return (
      <>
        <tr className="vm">
          <td>{offer.id}</td>
          <td>{status(offer)}</td>
          <td>{price(offer)}</td>
          <td>
            <AccountButton account={offer.buyer} />
          </td>
          <td>
            {offer.commission && offer.commission !== '0' ? (
              <>
                {`${offer.commission} OGN`}
                <Icon
                  style={{ verticalAlign: '-0.2rem', margin: '0 0.2rem' }}
                  icon="arrow-right"
                />
                <AccountButton account={offer.affiliate} />
              </>
            ) : null}
          </td>
          <td>
            <AccountButton account={offer.arbitrator} />
          </td>
          <td style={{ borderLeft: '1px solid rgba(16, 22, 26, 0.15)' }}>
            {this.renderBuyerActions(offer, buyerPresent)}
          </td>
          <td>{this.renderSellerActions(offer, sellerPresent)}</td>
          <td />
          <td>
            <Tooltip content="Add Data">
              <AnchorButton icon="comment" />
            </Tooltip>
          </td>
        </tr>

        <AcceptOffer
          isOpen={this.state.acceptOffer}
          listing={listing}
          listingId={listing.id}
          offerId={offer.id}
          onCompleted={() => this.setState({ acceptOffer: false })}
        />

        <FinalizeOffer
          isOpen={this.state.finalizeOffer}
          listingId={listing.id}
          offerId={offer.id}
          offer={offer}
          onCompleted={() => this.setState({ finalizeOffer: false })}
        />

        <WithdrawOffer
          isOpen={this.state.withdrawOffer}
          offer={offer}
          listingId={listing.id}
          offerId={offer.id}
          onCompleted={() => this.setState({ withdrawOffer: false })}
        />

        <AddFunds
          isOpen={this.state.addFunds}
          listingId={listing.id}
          offerId={offer.id}
          offer={offer}
          onCompleted={() => this.setState({ addFunds: false })}
        />
      </>
    )
  }

  renderInactiveRow() {
    const { offer } = this.props
    const offerData = offer.ipfs || {}
    return (
      <tr className="vm">
        <td>{offer.id}</td>
        <td>{status(offer)}</td>
        <td>{price(offerData)}</td>
        <td>
          <AccountButton account={offerData.buyer} />
        </td>
        <td>
          {offerData.commission && offerData.commission !== '0' ? (
            <>
              {`${offerData.commission} OGN`}
              <Icon
                style={{ verticalAlign: '-0.2rem', margin: '0 0.2rem' }}
                icon="arrow-right"
              />
              <AccountButton account={offerData.affiliate} />
            </>
          ) : null}
        </td>
        <td>
          <AccountButton account={offerData.arbitrator} />
        </td>
        <td style={{ borderLeft: '1px solid rgba(16, 22, 26, 0.15)' }} />
        <td />
        <td />
        <td>
          <Tooltip content="Add Data">
            <AnchorButton icon="comment" />
          </Tooltip>
        </td>
      </tr>
    )
  }

  renderBuyerActions(offer, buyerPresent) {
    if (offer.status === 1) {
      return (
        <>
          <Tooltip content="Update">
            <AnchorButton
              icon="edit"
              disabled={!buyerPresent}
              style={{ marginRight: 5 }}
            />
          </Tooltip>
          <Tooltip content="Withdraw">
            <AnchorButton
              intent="danger"
              icon="trash"
              disabled={!buyerPresent}
              onClick={() => this.setState({ withdrawOffer: true })}
            />
          </Tooltip>
        </>
      )
    }
    if (offer.status === 2) {
      return (
        <>
          <Tooltip content="Finalize">
            <AnchorButton
              intent="success"
              disabled={!buyerPresent}
              style={{ marginRight: 5 }}
              icon="tick"
              onClick={() => this.setState({ finalizeOffer: true })}
            />
          </Tooltip>
          <Tooltip content="Add Funds">
            <AnchorButton
              style={{ marginRight: 5 }}
              disabled={!buyerPresent}
              icon="dollar"
              onClick={() => this.setState({ addFunds: true })}
            />
          </Tooltip>
          <Tooltip content="Dispute">
            <AnchorButton
              intent="danger"
              icon="issue"
              disabled={!buyerPresent}
            />
          </Tooltip>
        </>
      )
    }
  }

  renderSellerActions(offer, sellerPresent) {
    if (offer.status === 2) {
      return (
        <>
          <Tooltip content="Set Refund">
            <AnchorButton icon="dollar" disabled={!sellerPresent} />
          </Tooltip>
          <Tooltip content="Dispute">
            <AnchorButton
              intent="danger"
              style={{ marginLeft: 5 }}
              icon="issue"
              disabled={!sellerPresent}
            />
          </Tooltip>
        </>
      )
    }
    if (offer.status === 1) {
      return (
        <>
          <Tooltip content="Accept">
            <AnchorButton
              intent="success"
              icon="tick"
              onClick={() => this.setState({ acceptOffer: true })}
              disabled={!sellerPresent}
            />
          </Tooltip>
          <Tooltip content="Decline">
            <AnchorButton
              disabled={!sellerPresent}
              intent="danger"
              style={{ marginLeft: 5 }}
              icon="cross"
            />
          </Tooltip>
        </>
      )
    }
  }
}

function price(offer) {
  if (offer.currency !== '0x0000000000000000000000000000000000000000') {
    return offer.value
  } else {
    return web3.utils.fromWei(offer.value, 'ether') + ' ETH'
  }
}

function status(offer) {
  if (offer.status === 0) {
    return <Tag>Withdrawn</Tag>
  }
  if (offer.status === 1) {
    return <Tag intent="warning">New</Tag>
  }
  if (offer.status === 2) {
    return <Tag intent="primary">Accepted</Tag>
  }
  if (offer.status === 4) {
    return <Tag intent="success">Finalized</Tag>
  }
  return offer.status
}

export default withRouter(withAccounts(Offers, 'marketplace'))