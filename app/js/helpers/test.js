export function simulateEvent(event, el, fieldName, fieldValue) {
  el.simulate(event, {
    target: {
      getAttribute: () => fieldName,
      tagName: 'input',
      value: fieldValue
    }
  });
}
