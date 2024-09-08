const log = (function () {
  const format = (level, lable) => `fuhe:${level}:[${lable}]:[${new Date().toISOString()}]:`;
  return {
    info: (label, ...args) => {
      console.log(format('info', label), ...args);
    },
    error: (label, ...args) => {
      console.error(format('error', label), ...args);
    },
  };
})();

export default log;
