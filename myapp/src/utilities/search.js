// Search utility
export function search(element, searchWord, attribute) {
  const words = element[attribute].split(/(\s+)/);
  for (const word of words) {
    if (word.toLowerCase().includes(searchWord.toLowerCase())) {
      return true; // Return true if any word matches the search term
    }
  }
  return false; // Return false if no word matches the search term
}

// Filters by the given
export function filterBySearch(list, searchWord, attribute) {
  return list.filter(x => search(x, searchWord, attribute));
}
