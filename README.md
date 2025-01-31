# StarMint NFT
A Clarity smart contract for minting NFTs that commemorate milestones and achievements.

## Features
- Mint unique NFTs with milestone metadata
- Transfer NFTs between users
- View milestone details and ownership history
- Admin controls for milestone verification

## Contract Interface
### Read-Only Functions
- get-token-uri (token-id)
- get-owner (token-id) 
- get-milestone-details (token-id)
- get-token-count

### Public Functions  
- mint (recipient milestone-details)
- transfer (token-id recipient)
- verify-milestone (token-id)
