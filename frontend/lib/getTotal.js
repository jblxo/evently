function getTotal(expenses = []) {
  const reducer = (acc, currentValue) => acc + currentValue;
  return expenses.map(({ amount }) => amount).reduce(reducer);
}

export default getTotal;
