import { useState } from "react";
import Head from "next/head";
import SmellSelector from "../components/SmellSelector";
import { supabase, Smell } from "../utils/supabaseClient";

export default function Home() {
  const [results, setResults] = useState<Smell[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectionChange = async (smell: string, location: string) => {
    if (!smell || !location) return;

    setLoading(true);
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
        console.error("API Error:", error);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data && Array.isArray(data)) {
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
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

        {loading ? (
          <div className="text-center py-5">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          results.length > 0 && (
            <div className="mt-5 space-y-4">
              {results.map((result) => (
                <div key={result.id} className="bg-surface rounded p-5">
                  <div className="text-white text-lg">
                    <span className="text-gray-400">Possible Cause: </span>
                    {result.causes[0]}
                  </div>
                  <div className="text-white mt-3 text-lg">
                    <span className="text-gray-400">Solution: </span>
                    {result.solutions[0]}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
