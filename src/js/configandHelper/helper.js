const upperFistChar = function (str) {
  return str.at(0).toUpperCase() + str.slice(1).toLowerCase();
};

const insertToElement = function (element, where, html) {
  element.insertAdjacentHTML(where, html);
};

const deleteById = function (array, delId) {
  //delete arr / object  from an array by id

  const delIndex = array.findIndex((entry) => entry.id === +delId);
  return array.splice(delIndex, 1);
};

export { upperFistChar, insertToElement, deleteById };
