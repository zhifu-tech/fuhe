const log = (function () {
  const format = (level, lable) => `fuhe:${level}:[${lable}]:[${new Date().toISOString()}]:`;
  return {
    info: (label, ...args) => {
      console.log(format('info', label), ...args);
    },
    error: (label, ...args) => {
      console.error(format('error', label), ...args);
    },
    error: (label, { code, message }) => {
      console.error(format('error', label), `code:${code || 'unknown'}-msg:${message || 'unknown'}`);
    },
  };
})();

export default log;
