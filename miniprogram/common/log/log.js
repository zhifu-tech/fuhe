export default (function () {
  const format = (level, lable) => `[fuhe:${level}]:[${new Date().toISOString()}]:[${lable}]`;
  return {
    info: (label, ...args) => {
      console.log(format('info', label), ...args);
    },
    error: (label, ...args) => {
      console.error(format('error', label), ...args);
    },
  };
})();
