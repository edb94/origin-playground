import { post } from 'utils/ipfsHash'

import getOffer from '../resolvers/getOffer'

/*
mutation makeOffer(
  $listingID: String,
  $finalizes: String,
  $affiliate: String,
  $commission: String,
  $value: String,
  $currency: String,
  $arbitrator: String
) {
  makeOffer(
    listingID: $listingID,
    finalizes: $finalizes,
    affiliate: $affiliate,
    commission: $commission,
    value: $value,
    currency: $currency,
    arbitrator: $arbitrator
  )
}
{
  "listingID": "0",
  "finalizes": "1536300000",
  "affiliate": "0x7c38A2934323aAa8dAda876Cfc147C8af40F8D0e",
  "commission": "0",
  "value": "100000000000000000",
  "currency": "0x0000000000000000000000000000000000000000",
  "arbitrator": "0x7c38A2934323aAa8dAda876Cfc147C8af40F8D0e"
}
*/

async function makeOffer(_, data, context) {
  return new Promise(async (resolve, reject) => {
    const buyer = data.from || web3.eth.defaultAccount
    const ipfsHash = await post(context.contracts.ipfsRPC, { ...data, buyer })

    const args = [
      data.listingID,
      ipfsHash,
      data.finalizes,
      data.affiliate,
      data.commission,
      data.value,
      data.currency,
      data.arbitrator
    ]

    context.contracts.marketplace.methods
      .makeOffer(...args)
      .send({
        gas: 4612388,
        from: web3.eth.defaultAccount,
        value: data.value
      })
      .on('confirmation', async (confirmations, receipt) => {
        if (confirmations === 1) {
          // const offer = await
          // console.log(offer)
          resolve(
            getOffer(context.contracts.marketplace, {
              listingId: data.listingID,
              idx: receipt.events.OfferCreated.returnValues.offerID
            })
          )
        }
      })
      .catch(reject)
      .then(() => {})
  })
}

export default makeOffer
