// script.js
document.getElementById('toolForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const PASSWORD = "robloxgenbyzane";
    const BASE_URL = "https://www.roblox.com/groups/";

    const passwordInput = document.getElementById('password').value;
    const numGroups = parseInt(document.getElementById('numGroups').value);
    const resultDiv = document.getElementById('result');

    if (passwordInput !== PASSWORD) {
        resultDiv.innerHTML = "<p style='color: red;'>Incorrect password</p>";
        return;
    }

    const groupIds = getRandomGroupIds(numGroups);
    resultDiv.innerHTML = "<p>Checking groups...</p>";

    let claimableGroups = [];

    for (let groupId of groupIds) {
        resultDiv.innerHTML += `<p>Checking group ${groupId}...</p>`;
        const isClaimable = await getGroupInfo(groupId);
        if (isClaimable) {
            claimableGroups.push(groupId);
            resultDiv.innerHTML += `<p>Group ${groupId} is claimable!</p>`;
        }
    }

    if (claimableGroups.length > 0) {
        resultDiv.innerHTML += "<h2>Claimable Groups:</h2>";
        claimableGroups.forEach(groupId => {
            resultDiv.innerHTML += `<p>${groupId}</p>`;
        });
    } else {
        resultDiv.innerHTML += "<p>No claimable groups found.</p>";
    }
});

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
