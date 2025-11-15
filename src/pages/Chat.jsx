// import React from 'react'

// function Chat() {
//   return (
//     <div>Chat</div>
//   )
// }

// export default Chat


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "../assets/Chat.css";

function Chat() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/"); // redirect to login if no user
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Fetch all other users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("getUsers.php");
        if (res.data.status === "success") {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="chat-container">
      {user && (
        <header className="chat-header">
          <div className="profile">
            <img
              src={`http://localhost/chatapp/php/uploads/${user.image}`}
              alt="profile"
              className="profile-img"
            />
            <div className="details">
            <span>{user.fname} {user.lname}</span>
            <p>Active Now</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </header>
      )}

      <div className="chat-body">
        <div className="search">
            <span className="text">Select a user to start chat</span>
            <input type="text" placeholder="Enter name to search..." />
            <button><i className="fas fa-search"></i></button>
        </div>
        <div className="users-list">
  {users.map((u) => (
    <a key={u.unique_id} className="user-item">
      <div className="content">
        <img
          src={
            u.img
              ? `http://localhost/chatapp/php/uploads/${u.img}`
              : "https://via.placeholder.com/150"
          }
          alt="user"
        />
        <div className="details">
          <span>{u.fname} {u.lname}</span>
          <p>Active now</p>
        </div>
      </div>
    </a>
  ))}
</div>


        <main className="chat-area">
          <p>Select a user to start chatting...</p>
        </main>
      </div>
    </div>
  );
}

export default Chat;


//  <div className="user-list">
//           {/* <h4>Users</h4> */}
//           <ul>
//             {users.map((u) => (
//               <li key={u.unique_id}>
//                 <img
//                   src={`http://localhost/chatapp/php/uploads/${u.img}`}
//                   alt="user"
//                   className="user-img"
//                 />
//                 <span>{u.fname} {u.lname}</span>
//               </li>
//             ))}
//           </ul>
//         </div>