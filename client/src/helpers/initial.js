const ZERO = 0, ONE = 1;

export default (names) => {
  const namesArray = names.split(' ');
  const initials = `${namesArray[ZERO][ZERO].toUpperCase()}
    ${namesArray[ONE][ZERO].toUpperCase()}`;

  return initials;
};