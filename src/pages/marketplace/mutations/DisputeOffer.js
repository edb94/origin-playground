import React, { Component } from 'react'
import { Mutation } from 'react-apollo'

import { Button, Dialog, FormGroup, InputGroup } from '@blueprintjs/core'

import { DisputeOfferMutation } from '../../../mutations'
import ErrorCallout from './_ErrorCallout'

class DisputeOffer extends Component {
  state = {
    reason: ''
  }

  render() {
    const input = field => ({
      value: this.state[field],
      onChange: e => this.setState({ [field]: e.currentTarget.value })
    })

    return (
      <Mutation
        mutation={DisputeOfferMutation}
        update={this.onUpdate}
        onCompleted={this.props.onCompleted}
      >
        {(disputeOffer, { loading, error }) => (
          <Dialog
            title="Dispute Offer"
            isOpen={this.props.isOpen}
            onClose={this.props.onCompleted}
          >
            <div className="bp3-dialog-body">
              <ErrorCallout error={error} />
              <FormGroup label="Reason">
                <InputGroup {...input('reason')} />
              </FormGroup>
            </div>
            <div className="bp3-dialog-footer">
              <div className="bp3-dialog-footer-actions">
                <Button
                  text="Dispute Offer"
                  intent="primary"
                  loading={loading}
                  onClick={() => disputeOffer(this.getVars())}
                />
              </div>
            </div>
          </Dialog>
        )}
      </Mutation>
    )
  }

  getVars() {
    return {
      variables: {
        listingID: String(this.props.listing.id),
        offerID: String(this.props.offer.id),
        from: this.props.offer.buyer.id
      }
    }
  }
}

export default DisputeOffer