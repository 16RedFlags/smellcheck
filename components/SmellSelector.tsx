import React, { useState, useEffect } from "react";
import { supabase, Smell } from "../utils/supabaseClient";

type Props = {
  onSelectionChange: (smell: string, location: string) => void;
  onLocationChange?: () => void;
};

interface SmellData {
  name: string;
  location: string;
}

interface LocationData {
  location: string;
}

export default function SmellSelector({
  onSelectionChange,
  onLocationChange,
}: Props) {
  const [allSmells, setAllSmells] = useState<SmellData[]>([]);
  const [filteredSmells, setFilteredSmells] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedSmell, setSelectedSmell] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    async function fetchOptions() {
      try {
        // Get all smells
        const smellsRes = await fetch("/api/smells", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "getSmells" }),
        });
        const smellData = await smellsRes.json();

        // Get locations
        const locationsRes = await fetch("/api/smells", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "getLocations" }),
        });
        const locationData = await locationsRes.json();

        if (smellData) {
          setAllSmells(smellData);
        }

        if (locationData && Array.isArray(locationData)) {
          setLocations(locationData);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const smellsForLocation = allSmells
        .filter((smell) => smell.location === selectedLocation)
        .map((smell) => smell.name);
      const uniqueSmells = [...new Set(smellsForLocation)];
      setFilteredSmells(uniqueSmells);
    } else {
      setFilteredSmells([]);
    }
    setSelectedSmell("");
  }, [selectedLocation, allSmells]);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setSelectedSmell("");
    onSelectionChange("", location);
    onLocationChange?.();
  };

  const handleSmellChange = (smell: string) => {
    setSelectedSmell(smell);
    onSelectionChange(smell, selectedLocation);
  };

  return (
    <div className="flex gap-4">
      <select
        className="flex-1 px-4 py-3 bg-surface border-border border rounded appearance-none focus:outline-none text-white text-base"
        value={selectedLocation}
        onChange={(e) => handleLocationChange(e.target.value)}
      >
        <option value="">Select location...</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      <select
        className="flex-1 px-4 py-3 bg-surface border-border border rounded appearance-none focus:outline-none text-white text-base disabled:opacity-50"
        value={selectedSmell}
        onChange={(e) => handleSmellChange(e.target.value)}
        disabled={!selectedLocation}
      >
        <option value="">
          {selectedLocation ? "Select smell..." : "Select location first"}
        </option>
        {filteredSmells.map((smell) => (
          <option key={smell} value={smell}>
            {smell}
          </option>
        ))}
      </select>
    </div>
  );
}
