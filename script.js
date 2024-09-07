// script.js
document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    startChecking();
});

const PASSWORD = "robloxgenbyzane";
const BASE_URL = "https://www.roblox.com/groups/";
const CLAIM_URL = "https://www.roblox.com/groups/{}/claim";
const CHECK_INTERVAL = 300000; // 5 minutes interval
const BATCH_SIZE = 100; // Process 100 groups per batch

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

    while (true) {
        let groupIds = getRandomGroupIds(numGroups);
        let batch = [];

        for (let i = 0; i < numGroups; i += BATCH_SIZE) {
            batch = groupIds.slice(i, i + BATCH_SIZE);
            await processBatch(batch);
        }

        updateClaimableLinks();
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL)); // Wait before next batch
    }
}

function getRandomGroupIds(numIds) {
    let ids = [];
    for (let i = 0; i < numIds; i++) {
        ids.push(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
    }
    return ids;
}

async function processBatch(groupIds) {
    for (let groupId of groupIds) {
        resultDiv.innerHTML += `<p>Checking group ${groupId}...</p>`;
        const isClaimable = await getGroupInfo(groupId);
        if (isClaimable) {
            claimableGroups.push(groupId);
            claimableUrls.push(`${BASE_URL}${groupId}`);
            resultDiv.innerHTML += `<p>Group ${groupId} is claimable! <a href="${BASE_URL}${groupId}" target="_blank">View</a></p>`;
        }
    }
}

async function getGroupInfo(groupId) {
    let url = `${BASE_URL}${groupId}`;
    try {
        let response = await fetch(url);
        let text = await response.text();
        if (text.includes("Group not found")) {
            return null;
        }
        if (text.includes("Claim Group")) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error checking group ${groupId}:`, error);
        return false;
    }
}

function updateClaimableLinks() {
    const linksDiv = document.getElementById('links');
    if (claimableUrls.length > 0) {
        linksDiv.innerHTML = "<h2>Claimable Group Links:</h2>";
        claimableUrls.forEach(url => {
            linksDiv.innerHTML += `<p><a href="${url}" target="_blank">${url}</a></p>`;
        });
    } else {
        linksDiv.innerHTML = "<p>No claimable groups found.</p>";
    }
}

