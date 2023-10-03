import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState([]);

  useEffect(() => {
    getUsers();
  }, [page]);

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get(`/users?page=${page}`)
      .then(({ data }) => {
        console.log(data);
        setLoading(false);
        setUsers(data.data);
        setMeta(data.meta);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const nextPage = () => {
    if (meta.last_page !== meta.current_page) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const onDelete = (u) => {
    if (!window.confirm("Are you sure delete " + u.name)) {
      return;
    }
    axiosClient.delete(`/users/${u.id}`).then(() => {
      setNotification("User delete success");
      getUsers();
    });
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Users</h1>
        <Link to={"/users/new"} className="btn-add">
          Add new
        </Link>
      </div>
      <div className="card animated fedeInDown">
        <table>
          <thead>
            <tr>
              <th colSpan={4}></th>
              <th>
                <button onClick={prevPage} className="btn">
                  prev
                </button>
                &nbsp;
                <button onClick={nextPage} className="btn">
                  next
                </button>
              </th>
            </tr>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            )}
            {!loading &&
              users.map((u) => {
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.created_at}</td>
                    <td>
                      <Link to={"/users/" + u.id} className="btn-edit">
                        Edit
                      </Link>
                      &nbsp;
                      <button
                        onClick={(ev) => onDelete(u)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
