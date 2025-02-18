import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../utils/config";

// Create Supabase client with service role key for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to verify request origin
const isValidOrigin = (origin: string | undefined) => {
  if (config.isDevelopment) return true;
  return origin && config.allowedOrigins.includes(origin);
};

// Sanitize inputs
const sanitizeString = (str: string) => {
  return str.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, location, smell } = req.body;

  // Basic input validation
  if (!type || typeof type !== "string") {
    return res.status(400).json({ error: "Invalid request type" });
  }

  try {
    switch (type) {
      case "getLocations":
        const { data: locations, error: locError } = await supabase
          .from("smells")
          .select("location")
          .order("location");

        console.log("Locations query:", { data: locations, error: locError });

        if (locError) throw locError;
        const uniqueLocations = [
          ...new Set(locations?.map((l) => l.location) || []),
        ];
        return res.status(200).json(uniqueLocations);

      case "getSmells":
        const { data: smells, error: smellError } = await supabase
          .from("smells")
          .select("name, location")
          .order("name");

        console.log("Smells query:", { data: smells, error: smellError });

        if (smellError) throw smellError;
        return res.status(200).json(smells);

      case "getResults":
        if (!smell || !location) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Sanitize inputs only for database queries
        const sanitizedSmell = sanitizeString(smell);
        const sanitizedLocation = sanitizeString(location);

        const { data: results, error: resultError } = await supabase
          .from("smells")
          .select("*")
          .eq("name", sanitizedSmell)
          .eq("location", sanitizedLocation);

        console.log("Results query:", { data: results, error: resultError });

        if (resultError) throw resultError;
        return res.status(200).json(results);

      default:
        return res.status(400).json({ error: "Invalid request type" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
