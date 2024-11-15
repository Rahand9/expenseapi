import React, { useState } from 'react';
/* useState is a react hook that lets you add state to functional components
which allows your component to track and respond to changes over time (like updating a value when a button is clicked).*/
// now as to why we use curly braces around useState is in order to only pull out useState function from react library rather than everything from react library 
import axios from 'axios';
//Axios is a popular JavaScript library used to make HTTP requests like GET, POST, PUT, DELETE to a server

function Signup() {
  const [username, setUsername] = useState('');
  // initializes a state variable called username with an empty string.(a state variable is a variable that can change data overtime it's dynamic)
  // The setUsername function updates username as the user types in the input field.
  // When the user submits the form the current value of username is logged to the console showing whatever the user typed in the input field
  const [password, setPassword] = useState('');
  const handleSignup = async (e) => {
    // async allows us to use await within the function 
    // (e) allows us to intercept and control what happens when the form is submitted.
    e.preventDefault();
    // This is a method of the event object that prevents the default behavior of the event
    // now in our case the event is an form submission and the default behavior is for the page to refresh whenever the form is submitted
    //by using e.preventDefault(); we prevent the behavior(the refresh in our case)
    try {
      const response = await axios.post('/auth/signup', { username, password });
      //sends a POST request to the server to create a new user account using the provided username and password
      console.log('User signed up:', response.data);
      // .data property contains the actual data sent back by the server in response to our request
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    //The return statement in a React functional component is for defining what the component should render (meaning what should be displayed)(user interface)
    <form onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
// form is an HTML element that creates a form for user input usually they are used to collect data from users (like usernames and passwords)
// onSubmit={handleSignup} means that when the form is submitted (exp the user clicks a submit button) the function handleSignup will be called
//<input/> is an html element that allows user to enter data
//tpe specifys the input field in our case it will be text because we are getting username from user
// placeholder is a hint that appears inside the input field when it is EMPTY it tells the user what kind of information they should enter.(in our case a username)
// value={username} this links the input to a state variable called username (remember state variable is a variable that changes overtime)
// onChange={(e) => setUsername(e.target.value)} means that whenever the user types in the input field this function will be triggered
// onChange this event occurs whenever the content of the input changes like when the user types
// (e) e is the event object that contains information about the event
// setUsername(e.target.value) this updates the username state with the current value of the input field
// e.target.value gets the current value that the user has typed into the input field.


}

export default Signup;
