// Search utility
function search(element, searchWord) {
  const words = element.commodityName.split(/(\s+)/);
  for (const word of words) {
    if (word.toLowerCase().includes(searchWord.toLowerCase())) {
      return true; // Return true if any word matches the search term
    }
  }
  return false; // Return false if no word matches the search term
}

export function filterBySearch(list, searchWord) {
  return list.filter(x => search(x, searchWord));
}
