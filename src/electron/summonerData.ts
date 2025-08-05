import dotenv from 'dotenv'; 
dotenv.config();

interface getUserData {
    fetch(puuid: string): Promise<any>;
    key: string;
}

export async function getSummonerData(user: string) {
    try {
        const username = user.split('#')[0];
        const tag = user.split('#')[1];
        const region = 'euw1';
        
        if (!username || !tag) {
            throw new Error('Please enter username in format "name#tag"');
        }

        const puuid = await getPuuid(username, tag);

        const apis: getUserData[] = [
            getProfileData,
            getRankedData
        ];

        const res: Record<string, any> = {};
        for(const api of apis){
            res[api.key] = await api.fetch(puuid);
        }

        return res;

    } catch (error) {
        console.error('Error in getSummonerData:', error);
        throw error;
    }
}

const getPuuid = async (username: string, tag :string): Promise<string> => {
    const res = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}?api_key=${process.env.API_KEY}`);
    if(!res.ok) throw new Error('failed to fetch profile data');
    const data = await res.json();
    return data.puuid;
}

const getProfileData : getUserData = {
    key : 'profileData',

    async fetch(puuid: string): Promise<any> {
        const res = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.API_KEY}`);
        if(!res.ok) throw new Error('failed to fetch profile data');
        return res.json();
    }
}

const getRankedData : getUserData = {
    key : 'rankedData',

    async fetch(puuid: string): Promise<any> {
        const res = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${process.env.API_KEY}`);
        if(!res.ok) throw new Error('failed to fetch ranked data');
        return res.json();
    }
}