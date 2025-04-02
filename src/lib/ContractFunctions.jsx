import Web3 from "web3";
import Tender from "@/contracts/TenderManagement.json";

let web3;
let contract;
let account;

/**
 * Initialize Web3 and the contract instance.
 */
export const initializeContract = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // await window.ethereum.request({ method: "eth_requestAccounts" });
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Tender.networks[networkId];
      contract = new web3.eth.Contract(
        Tender.abi,
        deployedNetwork && deployedNetwork.address
      );
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      localStorage.setItem('account', account);
      return { account, contract };
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw new Error("Failed to initialize contract");
    }
  } else {
    throw new Error("Ethereum provider not found");
  }
};

/**
 * Determine the user's role based on their address.
 * @returns {Promise<boolean>} The role of the user.
 */

export async function isAdmin() {
  if (!contract || !account) {
    return null;
  }
  try {
      const result = await contract.methods.isAdmin(account).call();
      console.log("Is admin:", result);
      return result; // Returns true if admin, false otherwise
  } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
  }
}

/**
 * Create a new tender.
 * @param {string} tenderName - The name of the tender.
 * @param {string} tenderType - The type of the tender.
 * @param {number} bidSubmissionDeadline - The timestamp for bid submission deadline.
 * @param {number} contractSignDeadline - The timestamp for contract signing deadline.
 * @param {number} estimatedCost - The estimated cost of the tender.
 * @param {string} tenderDetails - Additional details about the tender.
 * @returns {Promise<string>} The transaction hash.
 */
export const createTender = async (
  tenderName,
  tenderType,
  bidSubmissionDeadline,
  contractSignDeadline,
  estimatedCost,
  tenderDetails,
) => {
  try {
    // Ensure the contract and account are defined
    if (!contract || !account) {
      throw new Error("Contract or account not initialized");
    }

    // Call the createTender function on the smart contract
    const tx = await contract.methods
      .createTender(
        tenderName,
        tenderType,
        bidSubmissionDeadline,
        contractSignDeadline,
        estimatedCost,
        tenderDetails
      )
      .send({ from: account });

    return tx.transactionHash;
  } catch (error) {
    console.error("Error creating tender:", error);
    throw new Error("Failed to create tender");
  }
};

/**
 * Fetch details of all tenders.
 * @returns {Promise<Object[]>} Array of tender details.
 */
export const getAllTenderDetails = async () => {
  try {
    if (!contract || !account) {
      throw new Error("Contract or account not initialized");
    }

    const tenders = await contract.methods.getAllTenderDetails().call();
    return tenders.map((tender) => ({
      tenderId: tender.tenderId,
      tenderName: tender.tenderName,
      tenderType: tender.tenderType,
      bidSubmissionDeadline: Number(tender.bidSubmissionDeadline),
      contractSignDeadline: Number(tender.contractSignDeadline),
      estimatedCost: Number(tender.estimatedCost),
      tenderDetails: tender.tenderDetails,
      isOpen: tender.isOpen,
      approved: tender.approved,
    }));
  } catch (error) {
    console.error("Error fetching all tenders:", error);
    throw new Error("Failed to fetch all tenders");
  }
};

/**
 * Submit a bid for a tender.
 * @param {string} tenderId - The ID of the tender.
 * @param {number} amount - The bid amount.
 * @param {number} currentDate - The timestamp of the bid.
 * @returns {Promise<string>} Transaction hash.
 */
export const submitBid = async (tenderId, amount, currentDate) => {
  console.log("Submitting bid:", tenderId, amount, currentDate, account);
  if (!contract || !account) {
    throw new Error("Contract or account not initialized");
  }

  try {
    const gas = await contract.methods.submitBid(tenderId, amount, currentDate, account).estimateGas({ from: account });
        const tx = await contract.methods.submitBid(tenderId, amount, currentDate, account).send({ from: account, gas });
    console.log(tx)
    return tx.transactionHash;
  } catch (error) {
    console.error("Error submitting bid:", error);
    throw new Error("Failed to submit bid");
  }
};


export async function getSubmittedBids(fromBlock = 0, toBlock = "latest") {
  if (!contract || !account) {
    throw new Error("Contract or account not initialized");
  }
  try {
      const events = await contract.getPastEvents("BidSubmitted", {
          fromBlock,
          toBlock
      });
      return events.map(e => ({
        tenderId: e.returnValues.tenderId,
          bidder: e.returnValues.bidder,
          amount: e.returnValues.amount,
          bidDate: e.returnValues.bidDate,
          transactionHash: e.transactionHash,
      }));
  } catch (error) {
      console.error("Error fetching bid events:", error);
      return [];
  }
}

export async function approveTender(tenderId,venderId){
  if (!contract || !account) {
    throw new Error("Contract or account not initialized");
  }
  try {
      const tx = await contract.methods.approveTender(tenderId,venderId).send({ from: account });
      return tx.transactionHash;
  } catch (error) {
      console.error("Error approving tender:", error);
      throw new Error("Failed to approve tender");
  }
}

export async function approveTenderDetails(fromBlock = 0, toBlock = "latest"){
  if (!contract || !account) {
    throw new Error("Contract or account not initialized");
  }
  try {
    const events = await contract.getPastEvents("TenderApproved", {
        fromBlock,
        toBlock
    });
    return events.map(e => ({
        tenderId: e.returnValues.tenderId,
        vendorId: e.returnValues.vendorId,
        approved: e.returnValues.approved,
        isOpen: e.returnValues.isOpen,
        transactionHash: e.transactionHash,
    }));
} catch (error) {
    console.error("Error fetching bid events:", error);
    return [];
}
}