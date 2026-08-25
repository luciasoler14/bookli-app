export const getCoverUrl = (coverId: number, size: "S" | "M" | "L") =>
  `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
