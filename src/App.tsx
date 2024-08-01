import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import sunnyLogo from './assets/sunny_logo.png';
import '@twa-dev/sdk';

function App() {
  const { connected } = useTonConnect();
  const { value, address, balance, sendIncrement } = useCounterContract(); 

  return (
    <div className='App'>
      <div className='Container'>
        <img src={sunnyLogo} alt="Center Image" className="CenterImage" />
        <TonConnectButton />

        <div className='Card'>
          <b>🏦 Sunny Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>💰 Fund Raising</b> 
          <div>{balance ? `${balance} TON` : 'Loading...'}</div>
        </div>


        <div className='Card'>
          <b>👶 Number of people feeding</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          🐱🍔🐱 Feed Sunny! 🐱🍔🐱
        </a>
      </div>
    </div>
  );
}

export default App;
