/*
mutation transferToken($token: String!, $from: String!, $to: String!, $value: String!) {
  transferToken(token: $token, from: $from, to: $to, value: $value)
}
{
  "token": "ogn",
  "from": "0x0CdaA819eB0BC9649591eeB1D7B0b4255C06EFD2",
  "to": "0xD7ebe7707b5160DD211F4206ffca1f3169f2E376",
  "value": "1"
}
*/
async function transferToken(_, { token, from, to, value }, context) {
  return new Promise((resolve, reject) => {
    const contract = context.contracts[token]
    if (!contract) {
      console.log(token, "not found")
      return
    }
    contract.methods.transfer(to, value).send({
      gas: 4612388,
      from
    })
      .on('confirmation', async confirmations => {
        if (confirmations === 1) {
          resolve({
            to: {
              id: `${token.toUpperCase()}_${to}`,
              balance: await contract.methods.balanceOf(to).call()
            },
            from: {
              id: `${token.toUpperCase()}_${from}`,
              balance: await contract.methods.balanceOf(from).call()
            }
          })
        }
      })
      .catch(reject)
      .then(() => {
        // data.marketplace.allListings[listingIdx].status = 'pending'
        // client.writeQuery({ query, data })
      })
  })
}

export default transferToken
