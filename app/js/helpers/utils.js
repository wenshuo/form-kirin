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
