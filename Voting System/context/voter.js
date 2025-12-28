"use client";
import {createContext,useContext,useState,useEffect} from 'react';
import {ethers} from 'ethers';
import {VOTING_CONTRACT_ADDRESS,VOTING_CONTRACT_ABI,PINATA_API_KEY,PINATA_SECRET_API_KEY,NETWORK_CONFIG} from './constants';

const VotingContext = createContext();

export const useVoting = () => {
  const context = useContext(VotingContext);
  if(!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

export const VotingProvider = ({children}) => {
  const [currentAccount,setCurrentAccount] = useState('');
  const [candidateLength,setCandidateLength] = useState(0);
  const [candidateArray,setCandidateArray] = useState([]);
  const [voterLength,setVoterLength] = useState(0);
  const [voterArray,setVoterArray] = useState([]);
  const [isOwner,setIsOwner] = useState(false);
  const [loading,setLoading] = useState(false);
  const [votingEndTime,setVotingEndTime] = useState(0);
  const [votingActive,setVotingActive] = useState(false);
  const [contract,setContract] = useState(null);
  const [provider,setProvider] = useState(null);
  const [signer,setSigner] = useState(null);
  const [winner,setWinner] = useState(null);

  // Initialize contract connection
  const initializeContract = async () => {
    try {
      if(typeof window.ethereum !== 'undefined') {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const votingContract = new ethers.Contract(
          VOTING_CONTRACT_ADDRESS,
          VOTING_CONTRACT_ABI,
          web3Signer
        );

        setProvider(web3Provider);
        setSigner(web3Signer);
        setContract(votingContract);

        return votingContract;
      }
    } catch(error) {
      console.error('Error initializing contract:',error);
      throw error;
    }
  };

  // // Connect wallet
  // const connectWallet = async () => {
  //   try {
  //     if(!window.ethereum) {
  //       alert('Please install MetaMask first!');
  //       return;
  //     }

  //     // Request account access
  //     const accounts = await window.ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });

  //     if(accounts.length > 0) {
  //       setCurrentAccount(accounts[0]);

  //       // Switch to Hardhat network
  //       try {
  //         await window.ethereum.request({
  //           method: 'wallet_switchEthereumChain',
  //           params: [{chainId: NETWORK_CONFIG.chainId}],
  //         });
  //       } catch(switchError) {
  //         // If network doesn't exist, add it
  //         if(switchError.code === 4902) {
  //           try {
  //             await window.ethereum.request({
  //               method: 'wallet_addEthereumChain',
  //               params: [NETWORK_CONFIG],
  //             });
  //           } catch(addError) {
  //             console.error('Failed to add network:',addError);
  //             alert('Failed to add Hardhat network to MetaMask');
  //             return;
  //           }
  //         } else {
  //           console.error('Failed to switch network:',switchError);
  //           alert('Please switch to Hardhat network manually');
  //           return;
  //         }
  //       }

  //       // Initialize contract
  //       const votingContract = await initializeContract();

  //       // Check if user is owner
  //       const owner = await votingContract.owner();
  //       const isOwnerCheck = accounts[0].toLowerCase() === owner.toLowerCase();
  //       setIsOwner(isOwnerCheck);

  //       // Get voting status
  //       await getVotingStatus();

  //       console.log('Wallet connected:',accounts[0]);
  //       console.log('Is owner:',isOwnerCheck);
  //       console.log('Contract address:',VOTING_CONTRACT_ADDRESS);
  //     }
  //   } catch(error) {
  //     console.error('Error connecting wallet:',error);
  //     if(error.code === 4001) {
  //       alert('Please connect your wallet to continue');
  //     } else {
  //       alert('Error connecting wallet: ' + error.message);
  //     }
  //   }
  // };

  const connectWallet = async () => {
    if(!window.ethereum) {
      alert("Please install MetaMask first!");
      return;
    }

    const expectedChainId = NETWORK_CONFIG.chainId; // e.g., "0x7A69" for 31337

    try {
      // 1. Get current chain ID
      const currentChainId = await window.ethereum.request({method: 'eth_chainId'});

      // 2. If not on expected chain, switch or add it
      if(currentChainId !== expectedChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: expectedChainId}],
          });
        } catch(switchError) {
          if(switchError.code === 4902) {
            // Chain not added to MetaMask, try adding
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORK_CONFIG],
              });
            } catch(addError) {
              console.error("Failed to add network:",addError);
              alert("Failed to add votechain network to MetaMask");
              return;
            }
          } else {
            console.error("Failed to switch network:",switchError);
            alert("Please switch to votechain network manually");
            return;
          }
        }
      }

      // 3. Now request wallet access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if(accounts.length === 0) {
        alert("No accounts found. Please unlock MetaMask.");
        return;
      }

      const account = accounts[0];
      setCurrentAccount(account);

      // 4. Initialize contract + check owner
      const votingContract = await initializeContract();
      const owner = await votingContract.owner();
      const isOwnerCheck = account.toLowerCase() === owner.toLowerCase();
      setIsOwner(isOwnerCheck);

      // 5. Load voting state
      await getVotingStatus();

      console.log("✅ Wallet connected:",account);
      console.log("👤 Is owner:",isOwnerCheck);
      console.log("📍 Contract address:",VOTING_CONTRACT_ADDRESS);
    } catch(error) {
      console.error("❌ Error connecting wallet:",error);
      if(error.code === 4001) {
        alert("Please connect your wallet to continue.");
      } else {
        alert("Error connecting wallet: " + error.message);
      }
    }
  };


  // Get voting status
  const getVotingStatus = async () => {
    try {
      if(!contract) return;

      const [active,endTime,currentTime] = await contract.getVotingStatus();
      setVotingActive(active);
      setVotingEndTime(Number(endTime) * 1000); // Convert to milliseconds

      // Check if voting has ended and get winner
      if(!active && Number(endTime) > 0 && Number(currentTime) >= Number(endTime)) {
        await getWinner();
      }

      console.log('Voting status:',{active,endTime: Number(endTime),currentTime: Number(currentTime)});
    } catch(error) {
      console.error('Error getting voting status:',error);
    }
  };

  // Get winner
  const getWinner = async () => {
    try {
      if(!contract) return;

      const [winnerId,winnerName,winnerVotes] = await contract.getWinner();
      if(Number(winnerId) > 0) {
        setWinner({
          id: Number(winnerId),
          name: winnerName,
          votes: Number(winnerVotes)
        });
      }
    } catch(error) {
      console.error('Error getting winner:',error);
    }
  };

  // Start voting (owner only)
  const startVoting = async (durationInMinutes = 60) => {
    try {
      if(!contract || !isOwner) {
        alert('Only the organizer can start voting');
        return;
      }

      setLoading(true);
      const tx = await contract.startVoting(durationInMinutes);
      await tx.wait();

      await getVotingStatus();
      alert('Voting started successfully!');
    } catch(error) {
      console.error('Error starting voting:',error);
      alert('Error starting voting: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload to IPFS using Pinata
  const uploadToIPFS = async (file) => {
    try {
      if(!file) {
        throw new Error('No file provided');
      }

      const formData = new FormData();
      formData.append('file',file);

      const metadata = JSON.stringify({
        name: `voter-${Date.now()}`,
        keyvalues: {
          type: 'voter-image'
        }
      });
      formData.append('pinataMetadata',metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions',options);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS',{
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
        },
        body: formData,
      });

      if(!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to upload to IPFS: ${errorData}`);
      }

      const data = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch(error) {
      console.error('Error uploading to IPFS:',error);
      throw error;
    }
  };

  // Upload candidate image to IPFS
  const uploadToIPFSCandidate = async (file) => {
    try {
      if(!file) {
        throw new Error('No file provided');
      }

      const formData = new FormData();
      formData.append('file',file);

      const metadata = JSON.stringify({
        name: `candidate-${Date.now()}`,
        keyvalues: {
          type: 'candidate-image'
        }
      });
      formData.append('pinataMetadata',metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions',options);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS',{
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
        },
        body: formData,
      });

      if(!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to upload to IPFS: ${errorData}`);
      }

      const data = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch(error) {
      console.error('Error uploading to IPFS:',error);
      throw error;
    }
  };

  // Get all candidates
  const getAllCandidates = async () => {
    try {
      if(!contract) return;

      setLoading(true);
      const candidates = await contract.getAllCandidates();

      const formattedCandidates = candidates.map(candidate => ({
        id: Number(candidate.id),
        name: candidate.name,
        image: candidate.image,
        age: Number(candidate.age),
        address: candidate.candidateAddress,
        voteCount: Number(candidate.voteCount)
      }));

      setCandidateArray(formattedCandidates);
      setCandidateLength(formattedCandidates.length);

      console.log('Candidates loaded:',formattedCandidates);
    } catch(error) {
      console.error('Error fetching candidates:',error);
    } finally {
      setLoading(false);
    }
  };

  // Get all voters
  const getAllVoterData = async () => {
    try {
      if(!contract) return;

      setLoading(true);
      const voters = await contract.getAllVoters();

      const formattedVoters = voters.map(voter => ({
        id: Number(voter.id),
        name: voter.name,
        image: voter.image,
        address: voter.voterAddress,
        position: voter.position,
        hasVoted: voter.hasVoted
      }));

      setVoterArray(formattedVoters);
      setVoterLength(formattedVoters.length);

      console.log('Voters loaded:',formattedVoters);
    } catch(error) {
      console.error('Error fetching voters:',error);
    } finally {
      setLoading(false);
    }
  };

  // // Register candidate (owner only)
  // const setCandidate = async (candidateForm,fileUrl,router) => {
  //   try {
  //     if(!contract) {
  //       alert('Contract not initialized. Please connect your wallet first.');
  //       return;
  //     }

  //     if(!isOwner) {
  //       alert('Only the organizer can register candidates');
  //       return;
  //     }

  //     if(!candidateForm.name || !candidateForm.address || !candidateForm.age || !fileUrl) {
  //       alert('Please fill all fields and upload an image');
  //       return;
  //     }

  //     if(!ethers.isAddress(candidateForm.address)) {
  //       alert('Please enter a valid Ethereum address');
  //       return;
  //     }

  //     setLoading(true);

  //     console.log('Registering candidate:',candidateForm);

  //     // const tx = await contract.registerCandidate(
  //     //   candidateForm.name,
  //     //   fileUrl,
  //     //   candidateForm.address,
  //     //   parseInt(candidateForm.age)
  //     // );

  //     const age = parseInt(candidateForm.age);
  //     if(isNaN(age) || age < 18) {
  //       alert('Invalid age: must be a number and at least 18');
  //       return;
  //     }

  //     const tx = await contract.registerCandidate(
  //       candidateForm.name,
  //       fileUrl,
  //       candidateForm.address,
  //       age
  //     );


  //     console.log('Transaction sent:',tx.hash);
  //     await tx.wait();
  //     console.log('Transaction confirmed');

  //     // Refresh candidates list
  //     await getAllCandidates();

  //     alert('Candidate registered successfully!');
  //     if(router) {
  //       router.push('/');
  //     }
  //   } catch(error) {
  //     console.error('Error registering candidate:',error);
  //     // if(error.code === 4001) {
  //     //   alert('Transaction was rejected by user');
  //     // } else if(error.message.includes('revert')) {
  //     //   alert('Transaction failed: ' + error.reason || error.message);
  //     // } else {
  //     //   alert('Error registering candidate: ' + error.message);
  //     // }

  //     if(error.code === 4001) {
  //       alert('Transaction was rejected by user');
  //     } else if(error?.error?.message?.includes('revert')) {
  //       alert('Transaction failed: ' + error.error.message);
  //     } else if(error?.reason) {
  //       alert('Transaction reverted: ' + error.reason);
  //     } else {
  //       alert('Error registering candidate: ' + error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Register candidate (owner only)
  const setCandidate = async (candidateForm,fileUrl,router) => {
    try {
      // 1. Check contract connection
      if(!contract) {
        alert('Contract not initialized. Please connect your wallet first.');
        return;
      }

      // 2. Verify ownership explicitly
      const currentOwner = await contract.owner();
      const signerAddress = await signer.getAddress();

      if(currentOwner.toLowerCase() !== signerAddress.toLowerCase()) {
        alert('You are not the contract owner. Only the owner can register candidates.');
        return;
      }

      // 3. Validate inputs
      if(!candidateForm.name || !candidateForm.address || !candidateForm.age || !fileUrl) {
        alert('Please fill all fields and upload an image');
        return;
      }

      if(!ethers.isAddress(candidateForm.address)) {
        alert('Please enter a valid Ethereum address');
        return;
      }

      const age = parseInt(candidateForm.age);
      if(isNaN(age) || age < 18) {
        alert('Invalid age: must be a number and at least 18');
        return;
      }

      setLoading(true);

      // 4. Send transaction with explicit gas limit
      const tx = await contract.registerCandidate(
        candidateForm.name,
        fileUrl,
        candidateForm.address,
        age,
        {gasLimit: 500000} // <<-- Critical fix: Add gas limit
      );

      console.log('Transaction sent:',tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');

      // Refresh candidates list
      await getAllCandidates();

      alert('Candidate registered successfully!');
      if(router) router.push('/');
    } catch(error) {
      console.error('Error registering candidate:',error);

      // Improved error messages
      if(error.code === 4001) {
        alert('Transaction rejected by user');
      } else if(error.reason) {
        alert(`Transaction failed: ${error.reason}`);
      } else if(error.message.includes('revert')) {
        alert('Transaction reverted. Check contract requirements.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  // Authorize voter (owner only)
  const createVoter = async (voterForm,fileUrl,router) => {
    try {
      if(!contract) {
        alert('Contract not initialized. Please connect your wallet first.');
        return;
      }

      if(!isOwner) {
        alert('Only the organizer can authorize voters');
        return;
      }

      if(!voterForm.name || !voterForm.address || !voterForm.position || !fileUrl) {
        alert('Please fill all fields and upload an image');
        return;
      }

      if(!ethers.isAddress(voterForm.address)) {
        alert('Please enter a valid Ethereum address');
        return;
      }

      setLoading(true);

      console.log('Authorizing voter:',voterForm);

      const tx = await contract.authorizeVoter(
        voterForm.name,
        fileUrl,
        voterForm.address,
        voterForm.position
      );

      console.log('Transaction sent:',tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');

      // Refresh voters list
      await getAllVoterData();

      alert('Voter authorized successfully!');
      if(router) {
        router.push('/voterlist');
      }
    } catch(error) {
      console.error('Error authorizing voter:',error);
      if(error.code === 4001) {
        alert('Transaction was rejected by user');
      } else if(error.message.includes('revert')) {
        alert('Transaction failed: ' + error.reason || error.message);
      } else {
        alert('Error authorizing voter: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cast vote
  const giveVote = async (candidateId) => {
    try {
      if(!contract) {
        alert('Contract not initialized. Please connect your wallet first.');
        return;
      }

      // Check if voting is active
      if(!votingActive) {
        alert('Voting is not currently active. Please wait for the organizer to start voting.');
        return;
      }

      // Check if user is authorized
      const isAuthorized = await contract.isVoterAuthorized(currentAccount);
      if(!isAuthorized) {
        alert('You are not authorized to vote. Please contact the organizer.');
        return;
      }

      // Check if user has already voted
      const hasVoted = await contract.hasVoterVoted(currentAccount);
      if(hasVoted) {
        alert('You have already cast your vote. Each voter can only vote once.');
        return;
      }

      setLoading(true);

      console.log('Casting vote for candidate:',candidateId);

      const tx = await contract.vote(candidateId);
      console.log('Transaction sent:',tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');

      // Refresh data
      await getAllCandidates();
      await getAllVoterData();

      alert('Vote cast successfully! Thank you for participating.');
    } catch(error) {
      console.error('Error casting vote:',error);
      if(error.code === 4001) {
        alert('Transaction was rejected by user');
      } else if(error.message.includes('revert')) {
        alert('Transaction failed: ' + error.reason || error.message);
      } else {
        alert('Error casting vote: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if(window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if(accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          // Reconnect with new account
          connectWallet();
        } else {
          setCurrentAccount('');
          setIsOwner(false);
          setContract(null);
          setProvider(null);
          setSigner(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged',handleAccountsChanged);
      window.ethereum.on('chainChanged',handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged',handleAccountsChanged);
        window.ethereum.removeListener('chainChanged',handleChainChanged);
      };
    }
  },[]);

  // Load data when contract is initialized
  useEffect(() => {
    if(contract && currentAccount) {
      getAllCandidates();
      getAllVoterData();
      getVotingStatus();
    }
  },[contract,currentAccount]);

  // Check voting status periodically
  useEffect(() => {
    if(contract && votingActive) {
      const interval = setInterval(() => {
        getVotingStatus();
      },10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  },[contract,votingActive]);

  const value = {
    currentAccount,
    candidateLength,
    candidateArray,
    voterLength,
    voterArray,
    isOwner,
    loading,
    votingEndTime,
    votingActive,
    winner,
    connectWallet,
    getAllCandidates,
    getAllVoterData,
    giveVote,
    setCandidate,
    createVoter,
    uploadToIPFS,
    uploadToIPFSCandidate,
    startVoting,
    getVotingStatus,
    getWinner,
  };

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  );
};