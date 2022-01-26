beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['get_title', 'get_desc', 'get_img'],
    changeMethods: [],
    sender: window.accountId
  })

  window.walletConnection = {
    requestSignIn() {
    },
    signOut() {
    },
    isSignedIn() {
      return true
    },
    getAccountId() {
      return window.accountId
    }
  }
})

test('get_title', async () => {
  const message = await window.contract.get_title({ account_id: window.accountId })
  expect(message).toEqual('No Title')
})

test('get_title', async () => {
  const message = await window.contract.get_desc({ account_id: window.accountId })
  expect(message).toEqual('No Desc')
})
test('get_title', async () => {
  const message = await window.contract.get_img({ account_id: window.accountId })
  expect(message).toEqual('No Img')
})
