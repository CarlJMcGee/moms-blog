import { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { userRouter } from "../../server/router/users";
import { trpc } from "../../utils/trpc";

export interface IUserTestingProps {}

const UserTesting: NextPage = (props: IUserTestingProps) => {
  // state
  const [userSearch, setUserSearch] = React.useState("");
  const [newUserInfo, setNewUserInfo] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [passToCheck, setPassToCheck] = React.useState({ email: "", pass: "" });

  // query
  const { data: users, isLoading: gettingUsers } = trpc.useQuery([
    "user.getAll",
  ]);

  // mutations
  const {
    mutateAsync: findUser,
    isLoading: findingUser,
    data: user,
  } = trpc.useMutation(["user.getOne"]);
  const {
    mutateAsync: addUser,
    isLoading: addingUser,
    data: newUser,
  } = trpc.useMutation(["user.addUser"]);
  const { mutateAsync: checkPass, data: isPassword } = trpc.useMutation([
    "user.loginTemp",
  ]);

  // handlers
  const searchHandler = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await findUser({ userId: userSearch });
  };
  const addUserHandler = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addUser({
      username: newUserInfo.username,
      email: newUserInfo.email,
      password: newUserInfo.password,
    });
  };
  const passCheckHandler = async function (
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    await checkPass({ email: passToCheck.email, pass: passToCheck.pass });
  };

  return (
    <div>
      <Head key={"testingUsers"}>
        <title>Testing for User Data</title>
      </Head>

      {gettingUsers ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h2 className="text-3xl">All Users</h2>
          <ul>
            {users?.map((user) => (
              <li key={user.id}>
                <p>
                  <span className="font-bold">{user.name}</span>{" "}
                  {user.canPost ? "Can post" : "Cannot post"} and{" "}
                  {user.banned ? "is banned" : "is not banned"}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <br />

      <form onSubmit={searchHandler}>
        <h3 className="text-3xl">Search</h3>
        <input
          type="text"
          className="bg-slate-300 rounded m-2 p-1"
          placeholder="User ID"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <button type="submit" className="bg-gray-300 rounded m-2 p-1">
          Search
        </button>
      </form>
      {user && (
        <p>
          <span className="font-bold">{user.name}</span>{" "}
          {user.canPost ? "Can post" : "Cannot post"} and{" "}
          {user.banned ? "is banned" : "is not banned"} and has{" "}
          {user._count.posts} posts and {user._count.comments} comments
        </p>
      )}

      <br />

      <form onSubmit={addUserHandler}>
        <h3 className="text-3xl">New User</h3>
        <input
          type="text"
          className="bg-slate-300 rounded m-2 p-1"
          placeholder="username"
          value={newUserInfo.username}
          onChange={(e) =>
            setNewUserInfo({ ...newUserInfo, username: e.target.value })
          }
        />
        <input
          type="text"
          className="bg-slate-300 rounded m-2 p-1"
          placeholder="email"
          value={newUserInfo.email}
          onChange={(e) =>
            setNewUserInfo({ ...newUserInfo, email: e.target.value })
          }
        />
        <input
          type="text"
          className="bg-slate-300 rounded m-2 p-1"
          placeholder="password"
          value={newUserInfo.password}
          onChange={(e) =>
            setNewUserInfo({ ...newUserInfo, password: e.target.value })
          }
        />
        <button type="submit" className="bg-gray-300 rounded m-2 p-1">
          Create Account
        </button>
      </form>
      {newUser && <p>New user {newUser.name} created!</p>}

      <br />

      <form onSubmit={passCheckHandler}>
        <h3 className="text-3xl">Check Password</h3>
        <input
          type="text"
          placeholder="email"
          className="bg-slate-300 rounded m-2 p-1"
          onChange={(e) =>
            setPassToCheck({ ...passToCheck, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="password"
          className="bg-slate-300 rounded m-2 p-1"
          onChange={(e) =>
            setPassToCheck({ ...passToCheck, pass: e.target.value })
          }
        />
        <button type="submit" className="bg-gray-300 rounded m-2 p-1">
          Check
        </button>
      </form>
      {isPassword ? (
        <p className="text-green-600">Correct</p>
      ) : (
        <p className="text-red-600">Incorrect</p>
      )}
    </div>
  );
};

export default UserTesting;
