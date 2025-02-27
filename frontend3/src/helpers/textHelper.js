export function capitalizeFirstLetter(text) {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeFirstLetterinSentence(sentence) {
  return sentence.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}

export function formatReadableDate(movieDate) {
  return new Date(movieDate).getFullYear();
}

export function formatReadableExactDate(movieDate) {
  return new Date(movieDate).getDate();
}
