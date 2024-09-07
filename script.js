// script.js
document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    startChecking();
});

const PASSWORD = "robloxgenbyzane";
const BASE_URL = "https://www.roblox.com/groups/";
const CHECK_INTERVAL = 300000; // 5 minutes interval

let claimableGroups = [];

async function startChecking() {
    const passwordInput = document.getElementById('password').value;
    const numGroups = parseInt(document.getElementById('numGroups').value);
    const resultDiv = document.getElementById('result');

    if (passwordInput !== PASSWORD) {
        resultDiv.innerHTML = "<p style='color: red;'>Incorrect password</p>";
        return;
    }

    resultDiv.innerHTML = "<p>Starting group checks...</p>";
    while (true) {
        let groupIds = getRandomGroupIds(numGroups);
        for (let groupId of groupIds) {
            resultDiv.innerHTML += `<p>Checking group ${groupId}...</p>`;
            const isClaimable = await getGroupInfo(groupId);
            if (isClaimable) {
                claimableGroups.push(groupId);
                resultDiv.innerHTML += `<p>Group ${groupId} is claimable!</p>`;
            }
        }

        saveClaimableGroups();
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

function saveClaimableGroups() {
    const blob = new Blob([claimableGroups.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claimable_groups.txt';
    a.click();
    URL.revokeObjectURL(url);
}
