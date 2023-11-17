// Search utility
export function search(element, searchWord, attribute) {
  const text = element[attribute].toLowerCase();
  const lowerCaseSearchWord = searchWord.toLowerCase();
  return text.includes(lowerCaseSearchWord);
}

// Filters by the given
export function filterBySearch(list, searchWord, attribute) {
  return list.filter(x => search(x, searchWord, attribute));
}
