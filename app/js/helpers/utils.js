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

export function getFieldName(props) {
  return fieldName(props.name || props.id);
}

export function getFieldNameForElement(el) {
  return fieldName(el.getAttribute('name') || el.getAttribute('id'));
}
