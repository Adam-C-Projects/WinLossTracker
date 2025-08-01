const API_KEY = 'RGAPI-803d1cdf-1261-4163-b768-2c9215572630';

export async function getSummonerData(user: string) {
    try {
        const username = user.split('#')[0];
        const tag = user.split('#')[1];
        const region = 'euw1';
        
        if (!username || !tag) {
            throw new Error('Please enter username in format "name#tag"');
        }

        const puuid = await getPuuid(username, tag);
        const profileData = await getProfileData(puuid);
        const rankedData = await getRankedData(puuid);
        
        return {
            profileData,
            rankedData
        };
    } catch (error) {
        console.error('Error in getSummonerData:', error);
        throw error;
    }
}

async function getPuuid(username: string, tag :string){
    const response = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}?api_key=${API_KEY}`);
  
    if (!response.ok) {
        throw new Error(`Failed to fetch PUUID: ${response.statusText}`);
    }

    const data = await response.json();
    return data.puuid;
}

async function getProfileData(puuid: string){
    const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

async function getRankedData(puuid: string){
    const response = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ranked data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}