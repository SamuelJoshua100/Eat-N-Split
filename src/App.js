// Importing necessary hooks and initial data
import { useState } from "react";

// Initial list of friends with their details
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

// Reusable Button component with children prop for content and onClick handler
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

// Main application component
export default function App() {
  const [friends, setFriends] = useState(initialFriends); // State to manage the list of friends
  const [showFriend, setShowFriend] = useState(false); // State to toggle friend form visibility
  const [selectedFriend, setSelectedFriend] = useState(null); // State to track the selected friend

  // Toggles the visibility of the Add Friend form
  function handleShowFriend() {
    setShowFriend((show) => !show);
  }

  // Adds a new friend to the list
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFriend(false); // Hides the Add Friend form after submission
  }

  // Selects or deselects a friend
  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowFriend(false); // Ensures the Add Friend form is closed when selecting a friend
  }

  // Updates the balance of the selected friend after splitting the bill
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value } // Updates the balance
          : friend
      )
    );

    setSelectedFriend(null); // Resets the selected friend after updating
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* Friends list and Add Friend form */}
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showFriend && <FormAddFriend onAddFriends={handleAddFriend} />}
        <Button onClick={handleShowFriend}>
          {showFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

// Component to display the list of friends
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

// Component to display individual friend details
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id; // Checks if the friend is selected

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {/* Displaying balance status */}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

// Form to add a new friend
function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState(""); // State for the friend's name
  const [image, setImage] = useState("https://i.pravatar.cc/48"); // State for the friend's image

  // Handles the form submission
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return; // Validation for empty fields

    const id = crypto.randomUUID(); // Generates a unique ID for the new friend

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0, // Initial balance is zero
    };

    onAddFriends(newFriend); // Adds the new friend

    setName("");
    setImage("https://i.pravatar.cc/48"); // Resets the form fields
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="">🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="">🌇Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

// Form to split a bill with a friend
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState(""); // State for the total bill
  const [paidByUser, setPaidByUser] = useState(""); // State for the amount paid by the user
  const paidByFriend = bill ? bill - paidByUser : ""; // Calculates the friend's share
  const [whoPays, setWhoPays] = useState("user"); // Tracks who is paying the bill

  // Handles the form submission
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return; // Validation for empty fields
    onSplitBill(whoPays === "user" ? paidByFriend : -paidByUser); // Updates balance based on payer
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label htmlFor="">💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label htmlFor="">🙎 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label htmlFor="">🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label htmlFor="">🤑 Who's paying the bill</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
