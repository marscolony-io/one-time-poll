const Poll = artifacts.require("Poll");
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Poll', ([notVoter1, , voter1, ...otherVoters]) => {
  let poll;

  before(async () => {
    poll = await Poll.deployed();
  });

  it('Started and cannot add voters', async () => {
    await expectRevert(poll.start(), 'already started');
    await expectRevert(poll.addVoters([
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    ]), 'Voting already started');
  });

  it('Voter count positive', async () => {
    const voterCount = parseInt(await poll.voterCount());
    expect(voterCount).to.be.above(0);
    const voters = await poll.getVoters();
    expect(voters.length).to.be.above(0);
  });

  it ('Non-voter cannot vote', async () => {
    await expectRevert(poll.vote(1, { from: notVoter1 }), 'you cannot vote');
  });

  it ('Voting deletes from voters; cannot vote twice', async () => {
    const voters = await poll.getVoters();
    expect(voters).to.include(voter1);
    await expectRevert(poll.vote(0, { from: voter1 }), 'wrong decision');
    const votingTx = await poll.vote(5, { from: voter1 });
    await expectEvent(votingTx, 'Vote');
    const votersAfter = await poll.getVoters();
    expect(votersAfter).to.not.include(voter1);
    const votesFor5 = parseInt(await poll.totalVotesFor(5));
    expect(votesFor5).to.be.equal(1);
    const whatVoter1VotedFor = parseInt(await poll.votedFor(voter1));
    expect(whatVoter1VotedFor).to.be.equal(5);

    await expectRevert(poll.vote(2, { from: voter1 }), 'already voted');
  });

  it('More voting', async () => {
    for (const voter of otherVoters) {
      await poll.vote(4, { from: voter });
    }
    const votesFor4 = parseInt(await poll.totalVotesFor(4));
    expect(votesFor4).to.be.equal(otherVoters.length);
    const voteCount = parseInt(await poll.voteCount());
    expect(voteCount).to.be.equal(otherVoters.length + 1); // all for 4 + 1 for 5 (see prev block)
  });
});
