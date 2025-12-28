# VoteChain - Complete Setup Instructions

## Prerequisites

Before starting, make sure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **MetaMask Browser Extension** - [Install here](https://metamask.io/)

## Step 1: Project Setup

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the project directory
   cd votechain-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Step 2: Blockchain Setup (Hardhat Local Network)

1. **Start Hardhat local blockchain**
   ```bash
   # Open a new terminal and run:
   npx hardhat node
   ```
   
   This will:
   - Start a local blockchain on `http://127.0.0.1:8545`
   - Create 20 test accounts with 10,000 ETH each
   - Display the private keys for these accounts

   **Keep this terminal running throughout development!**

2. **Deploy the smart contract**
   ```bash
   # In a new terminal, run:
   npx hardhat run scripts/deploy.js --network localhost
   ```
   
   This will deploy the VotingContract and display the contract address.

3. **Update the contract address**
   - Copy the contract address from the deployment output
   - Open `context/constants.js`
   - Replace the `VOTING_CONTRACT_ADDRESS` with your new contract address:
   ```javascript
   export const VOTING_CONTRACT_ADDRESS = "YOUR_NEW_CONTRACT_ADDRESS_HERE";
   ```

## Step 3: MetaMask Configuration

### Add Hardhat Network to MetaMask

1. **Open MetaMask** and click on the network dropdown (usually shows "Ethereum Mainnet")

2. **Add Network Manually**:
   - Click "Add network manually"
   - Fill in the following details:
     - **Network Name**: `Hardhat Local`
     - **New RPC URL**: `http://127.0.0.1:8545`
     - **Chain ID**: `31337`
     - **Currency Symbol**: `ETH`
     - **Block Explorer URL**: Leave empty

3. **Save** the network

### Import Test Accounts

1. **Get account private keys** from the Hardhat node terminal (the one running `npx hardhat node`)

2. **Import accounts to MetaMask**:
   - Click on your account icon (top right)
   - Select "Import Account"
   - Paste the private key of Account #0 (this will be the contract owner)
   - Repeat for Account #1, #2, etc. (these will be voters)

   **Recommended accounts to import**:
   - Account #0: Contract Owner/Organizer
   - Account #1-5: Test Voters

## Step 4: Start the Frontend

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to `http://localhost:3000`

## Step 5: Testing the Application

### As the Organizer (Account #0)

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select Account #0 in MetaMask
   - Approve the connection

2. **Register Candidates**
   - Go to "Add Candidate" in the navigation
   - Fill in candidate details:
     - Name: e.g., "Alice Johnson"
     - Address: Use Account #6 or #7 address from Hardhat
     - Age: e.g., 25
     - Upload an image
   - Click "Register Candidate"
   - Approve the transaction in MetaMask

3. **Authorize Voters**
   - Go to "Add Voter" in the navigation
   - Fill in voter details:
     - Name: e.g., "John Doe"
     - Address: Use Account #1 address from Hardhat
     - Position: e.g., "Software Engineer"
     - Upload an image
   - Click "Authorize Voter"
   - Approve the transaction in MetaMask

4. **Start Voting**
   - Go back to Home page
   - Click "Start Voting"
   - Enter duration (e.g., 60 minutes)
   - Approve the transaction

### As a Voter (Account #1-5)

1. **Switch Account**
   - In MetaMask, switch to Account #1 (or any authorized voter account)
   - Refresh the page

2. **Cast Vote**
   - Go to Home page
   - Click "Give Vote" on your preferred candidate
   - Approve the transaction in MetaMask

3. **View Results**
   - Check the live vote counts
   - View voter list to see participation

## Step 6: Troubleshooting

### Common Issues and Solutions

1. **"Contract not initialized" error**
   - Make sure Hardhat node is running
   - Verify the contract address in `constants.js` is correct
   - Try refreshing the page

2. **MetaMask connection issues**
   - Make sure you're on the Hardhat Local network
   - Try disconnecting and reconnecting your wallet
   - Clear MetaMask activity data if needed

3. **Transaction failures**
   - Check if you have enough ETH (test accounts start with 10,000 ETH)
   - Make sure you're using the correct account (owner for admin actions)
   - Check the browser console for detailed error messages

4. **Image upload issues**
   - Verify your internet connection (Pinata requires internet)
   - Check if the image file is under 5MB
   - Try with different image formats (PNG, JPG)

5. **"User rejected the request" error**
   - This is normal when you decline a MetaMask transaction
   - Simply try the action again and approve the transaction

### Reset Everything

If you need to start fresh:

1. **Stop Hardhat node** (Ctrl+C in the terminal)
2. **Restart Hardhat node**: `npx hardhat node`
3. **Redeploy contract**: `npx hardhat run scripts/deploy.js --network localhost`
4. **Update contract address** in `constants.js`
5. **Reset MetaMask accounts** (Settings > Advanced > Reset Account)

## Step 7: Features Overview

### For Organizers (Contract Owner)
- Register candidates
- Authorize voters
- Start/stop voting
- View all participants

### For Voters
- View candidates
- Cast votes (one vote per voter)
- View live results
- Check voting status

### System Features
- Real-time vote counting
- Countdown timer
- Winner announcement
- Decentralized image storage (IPFS/Pinata)
- Responsive design with dark/light themes

## Security Notes

- Only the contract owner can register candidates and authorize voters
- Each voter can only vote once
- All transactions are recorded on the blockchain
- Images are stored on IPFS for decentralization
- Voting has time limits set by the organizer

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all setup steps were completed correctly
3. Make sure Hardhat node is running
4. Ensure MetaMask is connected to the correct network
5. Try with different test accounts

The application includes comprehensive error handling and user feedback to guide you through any issues.