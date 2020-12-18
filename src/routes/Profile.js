import { authService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService } from '../fbase';


export default ({userObj,refreshUser}) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/")
  };

  const getMyNweets = async() => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("creatorAt")
      .get();
    console.log(nweets.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  }, [])

  const onChange = (event) => {
    const {
      target: {value},
    } = event;
    setNewDisplayName(value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName){
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser(authService.userObj);
    }
  };

  return (
    <>
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        placeholder="Display name"
        onChange={onChange}
        value={newDisplayName}
      />
      <input 
        type="submit" placeholder="Update profile"/>
    </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}