import { useEffect, useState } from "react";
import { getCountries } from "@/lib/getCountries";

export function useCountries() {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    getCountries().then(setCountries);
  }, []);
  return countries;
}