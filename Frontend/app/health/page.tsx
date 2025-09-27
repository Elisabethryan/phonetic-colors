"use client";

import { useEffect, useState } from "react";
import { fetchBeHealth, fetchDbHealth } from "../api/healthService";

export default function Health() {
  const [dbResponse, setDbResponse] = useState<
    { message: string; statusCode: number } | undefined
  >();
  const [beResponse, setBeResponse] = useState<
    { message: string; statusCode: number } | undefined
  >();
  const [dbHealthLoading, setDbHealthLoading] = useState(true);
  const [beHealthLoading, setBeHealthLoading] = useState(true);

  useEffect(() => {
    fetchDbHealth()
      .then((healthResponse) =>
        setDbResponse(healthResponse ? healthResponse : undefined)
      )
      .catch((err) => setDbResponse(err.message))
      .finally(() => setDbHealthLoading(false));

    fetchBeHealth()
      .then((healthResponse) =>
        setBeResponse(healthResponse ? healthResponse : undefined)
      )
      .catch((err) => setBeResponse(err.message))
      .finally(() => setBeHealthLoading(false));
  }, []);

  return (
    <div>
      <h1>Frontend is running ✅ </h1>
      <h1>Backend status: </h1>
      {beHealthLoading ? (
        "Loading..."
      ) : (
        <div>
          {beResponse?.statusCode === 200 ? "✅" : "❌"}
          {beResponse?.statusCode}
          <p>{beResponse?.message}</p>
        </div>
      )}
      <h1>Database status: </h1>
      {dbHealthLoading ? (
        "Loading..."
      ) : (
        <div>
          {dbResponse?.statusCode === 200 ? "✅" : "❌"}
          {dbResponse?.statusCode}
          <p>{dbResponse?.message}</p>
        </div>
      )}
    </div>
  );
}
