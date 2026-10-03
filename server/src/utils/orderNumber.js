const generateOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `THB-${random}`;
};

module.exports = { generateOrderNumber };
