import { useState } from 'react'
import {useEffect} from 'react'
import './App.css'
import Profile from './Profile';

function App() {

  const [profilePage, setProfilePage] = useState(false);
  const [username, setUsername] = useState('');
  const [region, setRegion] = useState('');
  const [summonerInfo, setSummonerInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(){
    if(!username) return;
    try {
      const result = await window.electron.getSummonerData(username, region);
      setSummonerInfo(result);
      setError(null); 
      setProfilePage(true);
    } catch (err) {
      console.log('failed to retrieve data', err);
      setError('Failed to retrieve summoner data'); 
      setSummonerInfo(null);
      setProfilePage(false);
    }
  }

  return (
    <>
      {profilePage ? <Profile username={username} summonerInfo={summonerInfo}/> : 
        <>
          <input
          placeholder="Enter your summoner"
          value={username}
          onChange={e => setUsername(e.target.value)}
          />
        <select
          id="region"
          name="region"
          value={region}
          onChange={e => setRegion(e.target.value)}
        >
          <option value="">Select region</option>
          <option value="euw">EUW</option>
          <option value="na">NA</option>
        </select>

        <button onClick={handleClick}>Get Summoner Data</button>
        {error && <div>{error}</div>}
      
        </>
      }
    </>
  )
}
export default App
