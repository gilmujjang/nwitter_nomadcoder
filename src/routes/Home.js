import React, { useEffect, useState } from "react";
import { dbService } from '../fbase';


const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async() => {
    const dbnweets = await dbService.collection("nweets").get()
    dbnweets.forEach(document => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      }
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getNweets();
  }, [])
  const onSubmit = async(event) => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      nweet,
      createAt: Date.now(),
    });
    setNweet("");
  };
  const onChange = (event) => {
    const { target:{value},} = event; 
    setNweet(value);
  };

  console.log(nweets);
  return(
    <div>
      <form>
        <input value={nweet} onChange={onChange} type="text" placeholder="Waht's on your mind?" maxLength={120}/>
        <input onClick={onSubmit} type="submit" value="Nweet"/>
      </form>
      <div>
        {nweets.map(nweet => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>)
        )}
      </div>
    </div>
  );
};
export default Home;