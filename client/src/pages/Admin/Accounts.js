import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users/admin")
      .then((res) => {
        setAccounts(res.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  return (
    <>
      <div className="end">
        <button className="btn" onClick={() => navigate("/accounts/add")}>
          Add Admin
        </button>
      </div>

      <h1 className="title center">Admin List</h1>

      <div className="card w-800 m-auto">
        <table className="table">
          <thead>
            <tr>
              <th scope="row">Name</th>
              <th scope="row">Email</th>
              <th scope="row">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.length === 0 && (
              <tr>
                <th colspan="3" className="center">
                  No records found.
                </th>
              </tr>
            )}
            {accounts &&
              accounts.map((account) => (
                <tr>
                  <th scope="row">{account.name}</th>
                  <td>{account.email}</td>
                  <td>
                    <button
                      className="action"
                      onClick={() => navigate(`/accounts/${account.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Accounts;
