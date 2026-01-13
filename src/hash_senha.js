const bcrypt = require('bcrypt');

(async () => {
  const senha = '123456'; // senha que você quer usar
  const hash = await bcrypt.hash(senha, 10);
  console.log(hash);
})();