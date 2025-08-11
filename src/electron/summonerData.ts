interface getUserData {
    key: string;
    url: (region:string,puuid: string) => string;
    errorMessage: string;
}

interface RegionCodes {
    platform: string;
    regional: string;
}

const regions: Record<string, RegionCodes> = {
    euw: {platform: 'euw1', regional: 'europe'},
    na: {platform: 'na1', regional: 'americas'}
}

const apis: getUserData[] = [
    {
        key: 'profileData',
        url: (region,puuid) => `https://${regions[region].platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.API_KEY}`,
        errorMessage: "failed to fetch profile data"
    },
    {
        key: 'rankedData',
        url: (region,puuid) => `https://${regions[region].platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${process.env.API_KEY}`,
        errorMessage: "failed to fetch ranked data"
    }
];

export async function getSummonerData(user: string, region: string) {
    try {
        const [username, tag] = user.split('#');
        
        if (!username || !tag) {
            throw new Error('Please enter username in format "name#tag"');
        }

        const puuid = await getPuuid(username, tag, region);

        const res: Record<string, any> = {};
        for(const api of apis){
            res[api.key] = await getData(api.url(region,puuid),api.errorMessage);
        }

        return res;

    } catch (error) {
        console.error('Error in getSummonerData:', error);
        throw error;
    }
}

const getPuuid = async (username: string, tag :string, region:string): Promise<string> => {
    console.log(regions[region]);
    const res = await fetch(`https://${regions[region].regional}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}?api_key=${process.env.API_KEY}`);
    if(!res.ok) throw new Error('failed to fetch profile data');
    
    const [data,error] = await tryCatch(res.json());
    if(error) throw new Error("failed to parse json");
    
    return data.puuid;
}

const getData = async <T>(url: string, errorMessage: string): Promise<T> => {
    const res = await fetch(url);
    if(!res.ok) throw new Error(errorMessage);

    const [data,error] = await tryCatch(res.json());
    if(error) throw new Error("failed to parse json");

    return data;
}

const tryCatch = async <T>(promise: Promise<T>): Promise<[T | null, any | null]> => {
    try {
        const data = await promise;
        return [data,null];
    }catch (err) {
        return [null, err];
    }
};