const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let VotingContract;
  let votingContract;
  let owner;
  let voter1;
  let voter2;
  let candidate1;
  let candidate2;

  beforeEach(async function () {
    [owner, voter1, voter2, candidate1, candidate2] = await ethers.getSigners();
    
    VotingContract = await ethers.getContractFactory("VotingContract");
    votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero candidates and voters", async function () {
      expect(await votingContract.candidateCount()).to.equal(0);
      expect(await votingContract.voterCount()).to.equal(0);
    });

    it("Should initialize with voting inactive", async function () {
      expect(await votingContract.votingActive()).to.equal(false);
    });
  });

  describe("Candidate Registration", function () {
    it("Should allow owner to register candidates", async function () {
      await votingContract.registerCandidate(
        "Alice Johnson",
        "https://example.com/alice.jpg",
        candidate1.address,
        25
      );

      expect(await votingContract.candidateCount()).to.equal(1);
      
      const candidate = await votingContract.getCandidate(1);
      expect(candidate.name).to.equal("Alice Johnson");
      expect(candidate.candidateAddress).to.equal(candidate1.address);
      expect(candidate.age).to.equal(25);
    });

    it("Should not allow non-owner to register candidates", async function () {
      await expect(
        votingContract.connect(voter1).registerCandidate(
          "Alice Johnson",
          "https://example.com/alice.jpg",
          candidate1.address,
          25
        )
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should not allow registration of underage candidates", async function () {
      await expect(
        votingContract.registerCandidate(
          "Young Candidate",
          "https://example.com/young.jpg",
          candidate1.address,
          17
        )
      ).to.be.revertedWith("Candidate must be at least 18 years old");
    });
  });

  describe("Voter Authorization", function () {
    it("Should allow owner to authorize voters", async function () {
      await votingContract.authorizeVoter(
        "John Doe",
        "https://example.com/john.jpg",
        voter1.address,
        "Software Engineer"
      );

      expect(await votingContract.voterCount()).to.equal(1);
      expect(await votingContract.isVoterAuthorized(voter1.address)).to.equal(true);
      
      const voter = await votingContract.getVoter(1);
      expect(voter.name).to.equal("John Doe");
      expect(voter.voterAddress).to.equal(voter1.address);
      expect(voter.position).to.equal("Software Engineer");
    });

    it("Should not allow non-owner to authorize voters", async function () {
      await expect(
        votingContract.connect(voter1).authorizeVoter(
          "John Doe",
          "https://example.com/john.jpg",
          voter1.address,
          "Software Engineer"
        )
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should not allow duplicate voter authorization", async function () {
      await votingContract.authorizeVoter(
        "John Doe",
        "https://example.com/john.jpg",
        voter1.address,
        "Software Engineer"
      );

      await expect(
        votingContract.authorizeVoter(
          "John Doe Again",
          "https://example.com/john2.jpg",
          voter1.address,
          "Manager"
        )
      ).to.be.revertedWith("Voter already authorized");
    });
  });

  describe("Voting Process", function () {
    beforeEach(async function () {
      // Register candidates
      await votingContract.registerCandidate(
        "Alice Johnson",
        "https://example.com/alice.jpg",
        candidate1.address,
        25
      );
      await votingContract.registerCandidate(
        "Bob Smith",
        "https://example.com/bob.jpg",
        candidate2.address,
        30
      );

      // Authorize voters
      await votingContract.authorizeVoter(
        "John Doe",
        "https://example.com/john.jpg",
        voter1.address,
        "Software Engineer"
      );
      await votingContract.authorizeVoter(
        "Jane Smith",
        "https://example.com/jane.jpg",
        voter2.address,
        "Designer"
      );
    });

    it("Should allow owner to start voting", async function () {
      await votingContract.startVoting(60); // 60 minutes
      expect(await votingContract.votingActive()).to.equal(true);
    });

    it("Should not allow starting voting without candidates", async function () {
      // Deploy new contract without candidates
      const newContract = await VotingContract.deploy();
      await newContract.waitForDeployment();

      await expect(
        newContract.startVoting(60)
      ).to.be.revertedWith("No candidates registered");
    });

    it("Should allow authorized voters to vote", async function () {
      await votingContract.startVoting(60);
      
      await votingContract.connect(voter1).vote(1);
      
      const candidate = await votingContract.getCandidate(1);
      expect(candidate.voteCount).to.equal(1);
      
      expect(await votingContract.hasVoterVoted(voter1.address)).to.equal(true);
    });

    it("Should not allow unauthorized voters to vote", async function () {
      await votingContract.startVoting(60);
      
      const [, , , , , unauthorizedVoter] = await ethers.getSigners();
      
      await expect(
        votingContract.connect(unauthorizedVoter).vote(1)
      ).to.be.revertedWith("You are not authorized to vote");
    });

    it("Should not allow double voting", async function () {
      await votingContract.startVoting(60);
      
      await votingContract.connect(voter1).vote(1);
      
      await expect(
        votingContract.connect(voter1).vote(2)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting when inactive", async function () {
      await expect(
        votingContract.connect(voter1).vote(1)
      ).to.be.revertedWith("Voting is not active");
    });

    it("Should track total votes correctly", async function () {
      await votingContract.startVoting(60);
      
      await votingContract.connect(voter1).vote(1);
      await votingContract.connect(voter2).vote(2);
      
      expect(await votingContract.getTotalVotes()).to.equal(2);
    });
  });

  describe("Winner Determination", function () {
    beforeEach(async function () {
      // Register candidates
      await votingContract.registerCandidate(
        "Alice Johnson",
        "https://example.com/alice.jpg",
        candidate1.address,
        25
      );
      await votingContract.registerCandidate(
        "Bob Smith",
        "https://example.com/bob.jpg",
        candidate2.address,
        30
      );

      // Authorize voters
      await votingContract.authorizeVoter(
        "John Doe",
        "https://example.com/john.jpg",
        voter1.address,
        "Software Engineer"
      );
      await votingContract.authorizeVoter(
        "Jane Smith",
        "https://example.com/jane.jpg",
        voter2.address,
        "Designer"
      );

      await votingContract.startVoting(60);
    });

    it("Should determine winner correctly", async function () {
      await votingContract.connect(voter1).vote(1);
      await votingContract.connect(voter2).vote(1);
      
      const [winnerId, winnerName, winnerVotes] = await votingContract.getWinner();
      expect(winnerId).to.equal(1);
      expect(winnerName).to.equal("Alice Johnson");
      expect(winnerVotes).to.equal(2);
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
      await votingContract.registerCandidate(
        "Alice Johnson",
        "https://example.com/alice.jpg",
        candidate1.address,
        25
      );
      await votingContract.authorizeVoter(
        "John Doe",
        "https://example.com/john.jpg",
        voter1.address,
        "Software Engineer"
      );
    });

    it("Should return all candidates", async function () {
      const candidates = await votingContract.getAllCandidates();
      expect(candidates.length).to.equal(1);
      expect(candidates[0].name).to.equal("Alice Johnson");
    });

    it("Should return all voters", async function () {
      const voters = await votingContract.getAllVoters();
      expect(voters.length).to.equal(1);
      expect(voters[0].name).to.equal("John Doe");
    });

    it("Should return voting status", async function () {
      const [active, endTime, currentTime] = await votingContract.getVotingStatus();
      expect(active).to.equal(false);
      expect(endTime).to.equal(0);
      expect(currentTime).to.be.greaterThan(0);
    });
  });
});