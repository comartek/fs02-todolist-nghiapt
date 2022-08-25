import "./App.css";
import { useEffect, useRef, useState } from "react";
import Table from "./components/Table/Table";
import { getLocalStored, deleteLocalStored } from "./components/localStored";
import { useNavigate, Link } from "react-router-dom";
import { axiosClient } from "./components/axios";
import imgAvatar from "./assets/aaa.jpg";
import {
  getAllTask,
  createTask,
  deleteTask,
  handleChangeStatus,
  panigiHi,
} from "./service/task";
import { handleLogout, handleDeleteUser } from "./service/user";

function App() {
  const auth = getLocalStored("auth");
  const user = auth?.user;
  ///////////////
  const [job, setJob] = useState("");
  const [jobs, setJobs] = useState([]);
  const ref = useRef(null);

  const [limit, setLimit] = useState(7);
  const [skip, setSkip] = useState(1);
  const navigate = useNavigate();

  // task

  const panigi = () => {
    function pre() {
      panigiHi(setSkip, skip).pre();
    }
    function next() {
      panigiHi(setSkip, skip).next();
    }

    return { next, pre };
  };

  const handleChangeStatusHai = (e, id) => {
    handleChangeStatus(e, id, () => getAllTask(setJobs, limit, skip));
  };

  const deleteTaskHai = (id) => {
    deleteTask(id, () => getAllTask(setJobs, limit, skip));
  };

  const createTaskHai = () =>
    createTask(job, ref, () => getAllTask(setJobs, limit, skip));

  function handleChange(e) {
    setJob(e.target.value);
  }
  useEffect(() => {
    getAllTask(setJobs, limit, skip);
  }, [skip]);
  //////////////////////
  ////// logout user

  const handleLogoutHai = () => {
    handleLogout(navigate);
  };
  /////////
  ///// delete user
  const handleDeleteUserHai = () => {
    handleDeleteUser(navigate);
  };

  //////////////////////
  //// get image from API
  const [image, setImage] = useState();
  async function getImage() {
    try {
      const res = await axiosClient.get(`user/${user._id}/avatar`);
      setImage(res.request.responseURL || imgAvatar);
    } catch (error) {
      setImage(imgAvatar);
    }
  }
  useEffect(() => {
    getImage();
  }, []);
  ///////////////////
  //// delete image
  async function handleDeleteImage() {
    try {
      await axiosClient.delete("user/me/avatar", {
        headers: { Authorization: "Bearer " + auth.token },
      });
      getImage();
      console.log("aaa");
    } catch (error) {
      alert(error);
    }
  }
  ////////////////////
  ///// delete user
  // async function handleDeleteUser() {
  //   try {
  //     await axiosClient.delete("user/me", {
  //       headers: { Authorization: "Bearer " + auth.token },
  //     });
  //     deleteLocalStored("auth");
  //     navigate("/");
  //   } catch (error) {
  //     alert(error);
  //   }
  // }

  return (
    <div className="App">
      <h1>TODOLISH for {user ? user?.email : null} </h1>

      <img
        src={image}
        style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
      />
      <br />
      <button onClick={handleDeleteImage}>Delete Image</button>
      <br />
      <br />
      <button style={{ marginBottom: 30 }} onClick={handleLogoutHai}>
        logout
      </button>
      <button
        style={{ marginBottom: 30, marginLeft: 20 }}
        onClick={handleDeleteUserHai}>
        Delete User
      </button>
      <Link to="/update">
        <button style={{ marginBottom: 30, marginLeft: 20 }}>
          Update User Profile
        </button>
      </Link>

      <br />
      <input
        name="content"
        type="text"
        placeholder="thêm công việc..."
        onChange={handleChange}
        ref={ref}
      />

      <button style={{ marginLeft: 20 }} onClick={createTaskHai}>
        ADD
      </button>
      <Table
        onDelete={deleteTaskHai}
        jobs={jobs}
        onChangeStatus={handleChangeStatusHai}
      />

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          gap: "50px",
        }}>
        <button onClick={() => panigi().pre()}>lui</button>
        <p>Page {skip}</p>
        <button onClick={() => panigi().next()}>tien</button>
      </div>
    </div>
  );
}

export default App;
