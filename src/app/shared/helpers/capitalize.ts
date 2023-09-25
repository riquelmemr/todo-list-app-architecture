function capitalize(str: string): string {
  return str.replace(/\b\w/g, (firstLetter) => firstLetter.toLocaleUpperCase());
}

export { capitalize };

