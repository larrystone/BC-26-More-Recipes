export default (param, value) => (param || '')
  .trim()
  .replace(/\s+/g, value || '');
