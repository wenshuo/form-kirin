function fieldName(name) {
  if (!name) {
    throw new Error('Field must have either name or id prop.');
  }

  return name;
}

export function isObject(value) {
  const type = typeof value;

  return value !== null && type === 'object';
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function getFieldName(props) {
  return fieldName(props.name || props.id);
}

export function getFieldNameForElement(el) {
  return fieldName(el.getAttribute('name') || el.getAttribute('id'));
}

export function getFieldValueForElement(el) {
  const elementName = el.tagName.toLowerCase();
  // handle select with or without multiple
  if (elementName === 'select') {
    // If select with multiple, we return an array otherwise we return string value
    return el.multiple ? Array.from(el.selectedOptions).map(e => e.value) : el.value;
  }

  return el.getAttribute('type') === 'checkbox' ? el.checked : el.value;
}

export function isNumber(value) {
  return /^-?\d*(\.\d+)?$/.test(value);
}

export function isString(value) {
  return typeof value === 'string';
}

export function cx(...args) {
  return args.filter(arg => !!arg).join(' ');
}

export function omit(target, propsToExclude = []) {
  return Object.keys(target).reduce((memo, key) => {
    if (propsToExclude.indexOf(key) === -1) {
      memo[key] = target[key];
    }
    return memo;
  }, {});
}

export function isEmpty(value) {
  return [undefined, null, false, true, ''].includes(value) || (isObject(value) && Object.keys(value).length === 0);
}

function equalObjects(a, b) {
  const keys = Object.keys(a);

  return keys.length === Object.keys(b) && keys.every(k => Object.is(a[k], b[k]));
}

export function isEqual(a, b) {
  return Object.is(a, b) || (isObject(a) && isObject(b) && equalObjects(a, b));
}

export function uniq(values) {
  return [...new Set(values)];
}
