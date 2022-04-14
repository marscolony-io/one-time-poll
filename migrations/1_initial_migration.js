const Poll = artifacts.require("Poll");
const fs = require('fs');

module.exports = async (deployer, network, accounts) => {
  let landlords = fs.readFileSync('./landlords.txt', 'utf-8').split('\n').map(lord => lord.trim()).filter(lord => lord.length > 5);
  if (network !== 'harmain') {
    const [ , , ...accountsExceptFirstTwo] = accounts;
    landlords = [...landlords, ...accountsExceptFirstTwo]; // for tests
  }
  await deployer.deploy(Poll);

  const poll = await Poll.deployed();
  // fill addresses in bunches of 150 (not to run out of gas)
  while (landlords.length) {
    const bunch = [];
    while (bunch.length < 150 && landlords.length > 0) {
      bunch.push(landlords.pop());
    }
    await poll.addVoters(bunch);
    console.log(landlords.length);
  }
  await poll.start();
};
