function search(element, searchWord) {
  return element.commodityName
    .toLowerCase()
    .startsWith(searchWord.toLowerCase());
}

export function filterBySearch(list, searchWord) {
  return list.filter(x => search(x, searchWord));
}
