import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractABI = []; // Add your contract ABI here

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  }

  async function flipCoin() {
    if (!contract) return;
    try {
      const tx = await contract.flip({ value: ethers.utils.parseEther(betAmount) });
      await tx.wait();
      const events = await contract.queryFilter('CoinFlipped', tx.blockNumber, tx.blockNumber);
      const event = events[0];
      setResult(event.args.won ? 'You won!' : 'You lost!');
    } catch (error) {
      console.error("Error flipping coin:", error);
      setResult('Error: ' + error.message);
    }
  }

  return (
    <div className="App">
      <h1>Coin Flip DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <input 
            type="text" 
            value={betAmount} 
            onChange={(e) => setBetAmount(e.target.value)} 
            placeholder="Bet amount in ETH"
          />
          <button onClick={flipCoin}>Flip Coin</button>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;