const queryDecoder = (obj, keys) => {
  const finalObj = {};
  // console.log("Query", obj);
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
    // console.log(key);
  }
  // console.log(finalObj);
  return finalObj;
};

module.exports = queryDecoder;
