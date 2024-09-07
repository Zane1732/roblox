// script.js
document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    startChecking();
});

const PASSWORD = "robloxgenbyzane";
const BASE_URL = "https://www.roblox.com/groups/";
const CLAIM_URL = "https://www.roblox.com/groups/{}/claim";
const CHECK_INTERVAL = 300000; // 5 minutes interval
const BATCH_SIZE = 9000; // Process 9000 groups per batch

let claimableGroups = [];
let claimableUrls = [];

async function startChecking() {
    const passwordInput = document.getElementById('password').value;
    const numGroups = parseInt(document.getElementById('numGroups').value);
    const resultDiv = document.getElementById('result');
    const linksDiv = document.getElementById('links');

    if (passwordInput !== PASSWORD) {
        resultDiv.innerHTML = "<p style='color: red;'>Incorrect password</p>";
        return;
    }

    resultDiv.innerHTML = "<p>Starting group checks...</p>";
    linksDiv.innerHTML = ""; // Clear previous links
    claimableGroups = [];
    claimableUrls = [];

    while (true) {
        let groupIds = await getGroupIdsFromAPI(numGroups);
        await processBatch(groupIds); // Process the entire batch in one go

        updateClaimableLinks();
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL)); // Wait before next batch
    }
}

async function getGroupIdsFromAPI(numIds) {
    let ids = [];
    try {
        let response = await fetch(`${BASE_URL}?limit=${numIds}`);
        let data = await response.json();
        ids = data.map(group => group.id); // Adjust based on actual API response
    } catch (error) {
        console.error('Error fetching group IDs:', error);
    }
    return ids;
}

async function processBatch(groupIds) {
    const resultDiv = document.getElementById('result');
    for (let groupId of groupIds) {
        resultDiv.innerHTML += `<p>Checking group ${groupId} at <a href="${BASE_URL}${groupId}" target="_blank">${BASE_URL}${groupId}</a>...</p>`;
        const isClaimable = await getGroupInfo(groupId);
        if (isClaimable) {
            claimableGroups.push(groupId);
            claimableUrls.push(`${BASE_URL}${groupId}`);
            resultDiv.innerHTML += `<p>Group ${groupId} is claimable! <a href="${BASE_URL}${groupId}" target="_blank">Claim Here</a></p
