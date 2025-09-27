"use client";

import { useEffect, useState } from "react";
import { fetchDbHealth } from "../api/healthService";

export default function Health() {
  const [dbResponse, setDbResponse] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDbHealth()
      .then((healthResponse) =>
        setDbResponse(healthResponse ? healthResponse.message : undefined)
      )
      .catch((err) => setDbResponse(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>✅ Frontend is running</h1>
      <h1>✅ Database status: </h1>
      {loading ? "Loading..." : dbResponse}
    </div>
  );
}
