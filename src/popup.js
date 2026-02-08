document.addEventListener('DOMContentLoaded', () => {
  // Save button handler
  document.getElementById('saveKeyBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();

    if (!apiKey) {
      alert('Please enter an API key!');
      return;
    }

    chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
      alert('API Key saved!');
      console.log(apiKey);
    });
  });

  // Test button handler (Modified to use Background Script)
  document.getElementById('testKeyBtn').addEventListener('click', async () => {

    const apiKeyObject = await chrome.storage.local.get(['geminiApiKey']);
    let apiKey = apiKeyObject["geminiApiKey"] || '';
    console.log(apiKey);

    if (!apiKey) {
      alert('No API key found!');
      return;
    }

    // Send a message to background.js to test the connection
    chrome.runtime.sendMessage({
      action: "generate",
      prompt: "Say 'The API Key provided works!' if you receive this.",
      extract: "System Test" 
    }, (response) => {
      if (chrome.runtime.lastError) {
        alert("Error connecting to background script: " + chrome.runtime.lastError.message);
        return;
      }

      if (response && response.result) {
        alert(response.result);
      } else {
        alert("An error occurred. Please check the API Key you provided is correct!");
      }
    });
  });
});
