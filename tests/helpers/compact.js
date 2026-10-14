// Statické testy hledají ve zdrojácích kompaktní zápis (např. style:'papir'). Prettier přidává mezery a koncové čárky,
// proto se zdroj před porovnáním stáhne: bez koncových čárek, bez mezer kolem interpunkce, ostatní mezery jako jedna.
export const compact = s =>
  s
    .replace(/,(\s*[}\])])/g, '$1')
    .replace(/\s*([{}()[\],;:=<>+?|&!*])\s*/g, '$1')
    .replace(/\s+/g, ' ');
