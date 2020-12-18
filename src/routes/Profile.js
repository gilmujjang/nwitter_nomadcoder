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
  <div className="container">
    <form onSubmit={onSubmit} className="profileForm">
      <input
        onChange={onChange}
        type="text"
        autoFocus
        placeholder="Display name"
        value={newDisplayName}
        className="formInput"
      />
      <input
        type="submit"
        value="Update Profile"
        className="formBtn"
        style={{
          marginTop: 10,
        }}
      />
    </form>
    <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
      Log Out
    </span>
  </div>
);
};