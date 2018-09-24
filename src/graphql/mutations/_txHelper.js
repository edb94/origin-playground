import pubsub from '../pubsub'

export default function txHelper({ tx, mutation, onConfirmation, context }) {
  return new Promise((resolve, reject) => {
    tx.once('transactionHash', hash => {
      resolve({ id: hash })
      pubsub.publish('TRANSACTION_UPDATED', {
        transactionUpdated: {
          id: hash,
          status: 'pending',
          mutation
        }
      })
    })
      .once('receipt', receipt => {
        if (context) {
          context.contracts.marketplace.eventCache.updateBlock(
            receipt.blockNumber
          )
        }
        pubsub.publish('TRANSACTION_UPDATED', {
          transactionUpdated: {
            id: receipt.transactionHash,
            status: 'receipt',
            mutation
          }
        })
      })
      .on('confirmation', function(confNumber, receipt) {
        if (context) {
          context.contracts.marketplace.eventCache.updateBlock(
            receipt.blockNumber
          )
        }
        if (confNumber === 1 && onConfirmation) {
          onConfirmation(receipt)
        }
        if (confNumber > 0) {
          pubsub.publish('TRANSACTION_UPDATED', {
            transactionUpdated: {
              id: receipt.transactionHash,
              status: 'confirmed',
              mutation,
              confirmations: confNumber
            }
          })
        }
      })
      .catch(reject)
  })
}
