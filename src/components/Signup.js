// import React from 'react'

// const Signup = () => {

//     return (
//         <div className='container mt-5'>
//             <form>
//                 <div class="form-group">
//                     <label for="Name">Name</label>
//                     <input type="text" class="form-control" id="Name" placeholder="Enter Name" required minLength="3" />
//                 </div>
//                 <div class="form-group my-2">
//                     <label for="Email">Email address</label>
//                     <input type="email" class="form-control" id="Email" aria-describedby="emailHelp" placeholder="Enter email" required />
//                 </div>
//                 <div class="form-group my-2">
//                     <label for="Password">Password</label>
//                     <input type="password" class="form-control" id="Password" placeholder="Password" minLength="6" required />
//                 </div>
//                 <button type="submit" class="btn btn-primary">Submit</button>
//             </form>

//         </div>

//     )
// }

// export default Signup
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch("https://keep-note-121.herokuapp.com/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // save the authtoken and redirect
      localStorage.setItem("authtoken", json.authtoken);
      navigate("/");
      props.showAlert("Account created successfully", "success");
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-3">
      <h3>Sign up</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            minLength={6}
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            minLength={6}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
