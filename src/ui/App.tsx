import { useState } from 'react'
import {useEffect} from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('');
  const [summonerInfo, setSummonerInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(){
  if(!username) return;

  try {
    const result = await window.electron.getSummonerData(username);
    setSummonerInfo(result);
    setError(null); 
  } catch (err) {
    console.log('failed to retrieve data', err);
    setError('Failed to retrieve summoner data'); 
    setSummonerInfo(null);
  }
}

  return (
    <>
      <input
        placeholder="Enter your summoner"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={handleClick}>Get Summoner Data</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {summonerInfo && (
        <div>
          <h3>Profile Data</h3>
          <pre>{JSON.stringify(summonerInfo.profileData, null, 2)}</pre>

          <h3>Ranked Data</h3>
          <pre>{JSON.stringify(summonerInfo.rankedData, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default App
