// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingContract {
    address public owner;
    uint256 public votingEndTime;
    bool public votingActive;
    
    struct Candidate {
        uint256 id;
        string name;
        string image;
        uint256 voteCount;
        address candidateAddress;
        uint256 age;
        bool exists;
    }
    
    struct Voter {
        uint256 id;
        string name;
        string image;
        address voterAddress;
        string position;
        bool hasVoted;
        bool authorized;
        bool exists;
    }
    
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => Voter) public voters;
    mapping(address => uint256) public voterAddressToId;
    mapping(address => bool) public authorizedVoters;
    mapping(address => bool) public hasVotedMapping;
    
    uint256 public candidateCount;
    uint256 public voterCount;
    
    event CandidateRegistered(uint256 indexed candidateId, string name, address candidateAddress);
    event VoterAuthorized(uint256 indexed voterId, string name, address voterAddress);
    event VoteCast(uint256 indexed candidateId, address indexed voter);
    event VotingStarted(uint256 endTime);
    event VotingEnded();
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorizedVoter() {
        require(authorizedVoters[msg.sender], "You are not authorized to vote");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive && block.timestamp < votingEndTime, "Voting is not active");
        _;
    }
    
    modifier hasNotVoted() {
        require(!hasVotedMapping[msg.sender], "You have already voted");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        votingActive = false;
        candidateCount = 0;
        voterCount = 0;
    }
    
    function startVoting(uint256 _durationInMinutes) external onlyOwner {
        require(!votingActive, "Voting is already active");
        require(candidateCount > 0, "No candidates registered");
        require(voterCount > 0, "No voters authorized");
        
        votingEndTime = block.timestamp + (_durationInMinutes * 60);
        votingActive = true;
        
        emit VotingStarted(votingEndTime);
    }
    
    function endVoting() external onlyOwner {
        require(votingActive, "Voting is not active");
        votingActive = false;
        emit VotingEnded();
    }
    
    function extendVoting(uint256 _additionalMinutes) external onlyOwner {
        require(votingActive, "Voting is not active");
        votingEndTime += (_additionalMinutes * 60);
    }
    
    function registerCandidate(
        string memory _name,
        string memory _image,
        address _candidateAddress,
        uint256 _age
    ) external onlyOwner {
        require(_age >= 18, "Candidate must be at least 18 years old");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_candidateAddress != address(0), "Invalid candidate address");
        
        candidateCount++;
        
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            image: _image,
            voteCount: 0,
            candidateAddress: _candidateAddress,
            age: _age,
            exists: true
        });
        
        emit CandidateRegistered(candidateCount, _name, _candidateAddress);
    }
    
    function authorizeVoter(
        string memory _name,
        string memory _image,
        address _voterAddress,
        string memory _position
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_voterAddress != address(0), "Invalid voter address");
        require(!authorizedVoters[_voterAddress], "Voter already authorized");
        
        voterCount++;
        
        voters[voterCount] = Voter({
            id: voterCount,
            name: _name,
            image: _image,
            voterAddress: _voterAddress,
            position: _position,
            hasVoted: false,
            authorized: true,
            exists: true
        });
        
        voterAddressToId[_voterAddress] = voterCount;
        authorizedVoters[_voterAddress] = true;
        
        emit VoterAuthorized(voterCount, _name, _voterAddress);
    }
    
    function vote(uint256 _candidateId) external onlyAuthorizedVoter votingIsActive hasNotVoted {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        // Mark voter as having voted
        hasVotedMapping[msg.sender] = true;
        uint256 voterId = voterAddressToId[msg.sender];
        if (voterId > 0) {
            voters[voterId].hasVoted = true;
        }
        
        // Increment candidate vote count
        candidates[_candidateId].voteCount++;
        
        emit VoteCast(_candidateId, msg.sender);
    }
    
    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        
        return allCandidates;
    }
    
    function getAllVoters() external view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](voterCount);
        
        for (uint256 i = 1; i <= voterCount; i++) {
            allVoters[i - 1] = voters[i];
        }
        
        return allVoters;
    }
    
    function getCandidate(uint256 _candidateId) external view returns (Candidate memory) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        return candidates[_candidateId];
    }
    
    function getVoter(uint256 _voterId) external view returns (Voter memory) {
        require(_voterId > 0 && _voterId <= voterCount, "Invalid voter ID");
        return voters[_voterId];
    }
    
    function isVoterAuthorized(address _voterAddress) external view returns (bool) {
        return authorizedVoters[_voterAddress];
    }
    
    function hasVoterVoted(address _voterAddress) external view returns (bool) {
        return hasVotedMapping[_voterAddress];
    }
    
    function getVotingStatus() external view returns (bool active, uint256 endTime, uint256 currentTime) {
        return (votingActive, votingEndTime, block.timestamp);
    }
    
    function getWinner() external view returns (uint256 winnerId, string memory winnerName, uint256 winnerVotes) {
        require(candidateCount > 0, "No candidates registered");
        
        uint256 highestVotes = 0;
        uint256 winningCandidateId = 0;
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
        
        if (winningCandidateId > 0) {
            return (winningCandidateId, candidates[winningCandidateId].name, highestVotes);
        }
        
        return (0, "", 0);
    }
    
    function getTotalVotes() external view returns (uint256) {
        uint256 totalVotes = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            totalVotes += candidates[i].voteCount;
        }
        return totalVotes;
    }
}