interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  flag: string;
}

export async function getCountries() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag"
  );
  const data = await res.json();

  return data
    .map((country: Country) => ({
      name: country.name?.common,
      code: country.cca2,
      dialCode: country.idd?.root
        ? country.idd.root + (country.idd.suffixes?.[0] || "")
        : "",
      flag: country.flag,
    }))
    .filter((c: { dialCode: string }) => c.dialCode);
}
