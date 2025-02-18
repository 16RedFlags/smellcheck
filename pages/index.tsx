import { useState } from "react";
import Head from "next/head";
import SmellSelector from "../components/SmellSelector";
import { supabase, Smell } from "../utils/supabaseClient";

// Add this type to better handle the data
interface SmellResult {
  id: number;
  name: string;
  location: string;
  causes: string[];
  solutions: string[];
}

export default function Home() {
  const [results, setResults] = useState<SmellResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectionChange = async (smell: string, location: string) => {
    if (!smell || !location) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/smells", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "getResults",
          smell,
          location,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch results");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center p-5">
      <Head>
        <title>What's That Smell?</title>
        <meta name="description" content="Find out what that smell is" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">Smell something weird?</h1>
          <p className="text-base text-gray-400">Find out what it is!</p>
        </div>

        <SmellSelector
          onSelectionChange={handleSelectionChange}
          onLocationChange={clearResults}
        />

        {error && (
          <div className="mt-5 p-4 bg-red-500/20 text-red-200 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          results.length > 0 && (
            <div className="mt-5 space-y-4">
              {results.map((result) => (
                <div key={result.id} className="bg-surface rounded p-5">
                  {result.causes.map((cause, index) => (
                    <div
                      key={`cause-${index}`}
                      className="text-white text-lg mb-4"
                    >
                      <span className="text-gray-400">
                        Possible Cause {index + 1}:{" "}
                      </span>
                      {cause}
                    </div>
                  ))}
                  {result.solutions.map((solution, index) => (
                    <div
                      key={`solution-${index}`}
                      className="text-white text-lg"
                    >
                      <span className="text-gray-400">
                        Solution {index + 1}:{" "}
                      </span>
                      {solution}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
