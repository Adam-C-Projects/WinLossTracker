import React from "react";
import Header from "./Header";


export function Profile({username ,summonerInfo}: {username:String, summonerInfo:String}){
    return(
        <>
            <div>
                <Header/>
            </div>
            
            <div>
                <p>{username.split("#")[0]}</p>
            </div>
        </>
    )
}

export default Profile;