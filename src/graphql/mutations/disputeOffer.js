import { post } from 'utils/ipfsHash'
import txHelper from './_txHelper'

async function disputeOffer(_, data, context) {
  const ipfsHash = await post(context.contracts.ipfsRPC, data)

  const tx = context.contracts.marketplaceExec.methods
    .dispute(data.listingID, data.offerID, ipfsHash)
    .send({
      gas: 4612388,
      from: data.from || web3.eth.defaultAccount
    })
  return txHelper({
    tx,
    context,
    mutation: 'disputeOffer'
  })
}

export default disputeOffer
