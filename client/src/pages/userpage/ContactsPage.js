import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../../components/user/NavBar";

const ContactsPage = () => {
  const { userId } = useParams();
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch contacts from API when the component mounts
  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8060/api/user/getcontact/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      setContacts(data.data || []);
    } else {
      console.error("Failed to fetch contacts", data.message);
    }
  };

  // Call fetchContacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, [userId]);

  // Add a new contact
  const handleAddContact = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8060/api/user/addcontact/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContact),
      }
    );

    const data = await response.json();
    if (response.ok) {
      setContacts([...contacts, data.contact]);
      setNewContact({ name: "", email: "", phone: "" });
    } else {
      console.error("Failed to add contact", data.message);
    }
  };

  // Delete a contact
  const deleteContact = async (id) => {
    const token = localStorage.getItem("token");
    console.log(id);

    const response = await fetch(
      `http://localhost:8060/api/user/removecontact/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      // setContacts(contacts.filter((contact) => contact.id !== id)); // Remove deleted contact
      fetchContacts();
    } else {
      console.error("Failed to delete contact", data.message);
    }
  };

  // Handle input changes for new contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  return (
    <>
      <UserNavbar />
      <div className="container mt-5">
        <h2>Contacts</h2>

        <div className="card p-5">
          <h3>Add a New Contact</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={newContact.phone}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <button onClick={handleAddContact} className="btn btn-primary mt-3">
            Add Contact
          </button>
        </div>

        {/* Conditionally render Existing Contacts section if there are contacts */}
        {contacts.length > 0 && (
          <div className="card p-5">
            <h3>Existing Contacts</h3>
            <div className="row">
              {contacts.map((contact) => (
                <div key={contact.id} className="col-md-4 mb-4">
                  <div className="card p-3">
                    <h5>{contact.name}</h5>
                    <p>Email: {contact.email}</p>
                    <p>Phone: {contact.phone}</p>
                    <button
                      onClick={() => deleteContact(contact._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactsPage;
