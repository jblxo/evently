function getTotal(expenses = []) {
  if (expenses.length <= 0) return 0;
  const reducer = (acc, currentValue) => acc + currentValue;
  return expenses.map(({ amount }) => amount).reduce(reducer);
}

export default getTotal;
