function uniqueUserArr(arr) {
  const unique = [];
  arr.forEach(({ user }) => {
    if (!unique.includes(user)) {
      unique.push(user);
    }
  });
  return unique;
}

export default uniqueUserArr;
