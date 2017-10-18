
export default (names) => {
  const namesArray = names.split(' ');
  const initials = `${namesArray[0][0].toUpperCase()}${namesArray[1][0].toUpperCase()}`;

  return initials;
}