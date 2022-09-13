import Head from "next/head";
import * as React from "react";
import { trpc } from "../../utils/trpc";

export interface IUserTestingProps {}

export default function UserTesting(props: IUserTestingProps) {
  // state
  const [userSearch, setUserSearch] = React.useState("");

  const { data: users, isLoading: gettingUsers } = trpc.useQuery([
    "user.getAll",
  ]);
  const { data: user, isLoading: findingUser } = trpc.useQuery([
    "user.getOne",
    { userId: userSearch },
  ]);

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
              <li>
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
      <form>
        <input
          type="text"
          className="border border-black rounded"
          placeholder="User ID"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <button type="submit" className="bg-gray-300 rounded m-2 p-1">
          Search
        </button>
      </form>
    </div>
  );
}
