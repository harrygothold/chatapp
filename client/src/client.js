import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "<prod-url>"
    : "http://localhost:4000/graphql";

export const useClient = () => {
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIdToken(token);
  }, []);
  return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken },
  });
};
