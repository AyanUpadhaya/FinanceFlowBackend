const getCurrentUnixTimestamp = () => {
  const currentDate = new Date();
  const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
  return unixTimestamp;
};


const timekoto = (prop) => {
  const date = Date.now();

  if (prop === "m") {
    // Return timestamp in milliseconds
    return date;
  } else {
    // Return timestamp in seconds
    return Math.floor(date / 1000);
  }
};


module.exports = { getCurrentUnixTimestamp, timekoto };