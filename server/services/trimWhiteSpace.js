export default (param, value) => (param || '')
  .replace(/\s+/g, value || '');
