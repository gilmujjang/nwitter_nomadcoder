import React, { useEffect, useState } from "react";
import { dbService } from '../fbase';


const Home = ({userObj}) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  
  useEffect(() => {
    dbService.collection("nweets").onSnapshot(snapshot => {
      const nweetArray = snapshot.docs.map(doc => ({
        id:doc.id,
         ...doc.data(),
      }))
      setNweets(nweetArray);
    })
  }, [])
  const onSubmit = async(event) => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = (event) => {
    const { target:{value},} = event; 
    setNweet(value);
  };

  return(
    <div>
      <form>
        <input value={nweet} onChange={onChange} type="text" placeholder="Waht's on your mind?" maxLength={120}/>
        <input onClick={onSubmit} type="submit" value="Nweet"/>
      </form>
      <div>
        {nweets.map(nweet => (
          <div key={nweet.id}>
            <h4>{nweet.text}</h4>
          </div>)
        )}
      </div>
    </div>
  );
};
export default Home;