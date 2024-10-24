import { format } from "timeago.js";
import { nanoid } from "nanoid";

const upperFistChar = function (str) {
  return str.at(0).toUpperCase() + str.slice(1).toLowerCase();
};

const insertToElement = function (element, where, html) {
  element.insertAdjacentHTML(where, html);
};

const deleteById = function (array, delId) {
  //delete arr / object  from an array by id

  const delIndex = array.findIndex((entry) => entry.id === delId);
  return array.splice(delIndex, 1);
};

const timeAgo = function (timestamp, full = false) {
  const [day, dateType] = format(timestamp).split(" ");
  const dateFormat = new Date(timestamp);

  const exceptions = ["weeks", "week", "months", "month"];
  const yearsExceptions = ["years", "year"];

  // prettier-ignore
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec",];

  if (full || yearsExceptions.includes(dateType))
    return dateFormat.toLocaleDateString();

  if (exceptions.includes(dateType))
    return `${months[dateFormat.getMonth()]} ${dateFormat.getDate()}`;

  if (dateType === "now") return "now";

  return day.concat(dateType.at(0));
};

const generateId = function () {
  return nanoid();
};

const escapeHtml = function (unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export {
  upperFistChar,
  insertToElement,
  deleteById,
  timeAgo,
  generateId,
  escapeHtml,
};
