
export default (names) => {
  const namesArray = names.split(' ');
  const initials = `${namesArray[0][0].toUpperCase()}${namesArray[1][0].toUpperCase()}`;

  // const initials = namesArray.reduce((acc, name) => {
  //   return acc + name[0].toUpperCase();
  // }, '');

  return initials;
}