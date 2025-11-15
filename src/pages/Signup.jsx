import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api"

function Signup() {
  const [fname, setFname] = useState("");
  const [lname, setLname ] = useState("");
//   const [name, ] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    // Handle image upload if needed
    setImage(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ fname, lname, email, password, confirmPassword });
    // Backend connection 
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    try{
        const formData = new FormData();
        formData.append("fname", fname);
        formData.append("lname", lname);
        formData.append("email", email);
        formData.append("password", password);

        if(image){
            formData.append("image", image); // add image file if selected
        }

        const res = await API.post("signup.php", formData);
        if(res.data.success){
            alert("Signup successful! Please login.");
            navigate("/");
        } else {
            setError(res.data.message || "Signup failed");
        }
    } catch(err) {
        console.error("Signup error:", err);
        setError("An error occurred during signup");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="First name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
        />

        {/* <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /> */}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <input 
        type="file"
         name="image" 
        accept="image/x-png,image/gif,image/jpeg,image/jpg"
        onChange={handleImageChange}
         />


        {error && <p className="error-message">{error}</p>}

        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
