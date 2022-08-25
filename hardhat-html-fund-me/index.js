async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    document.getElementById('connectButton').innerHTML = 'Connected'
    } catch (error) {
      console.log(error)
    }
    
  } else {
    document.getElementById('connectButton').innerHTML =
      'Please install Metamask!'
  }
}
