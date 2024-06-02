// background.js

/**
 * Sends bookmark or folder data to the specified webhook URL.
 *
 * @param {string} eventType - The type of bookmark event ('created', 'updated', 'deleted', 'moved').
 * @param {Object} data - The data of the event (bookmark or folder).
 */
async function sendDataToWebhook(eventType, data) {
  chrome.storage.sync.get(['webhookUrl', 'triggers'], async (storedData) => {
    const webhookUrl = storedData.webhookUrl;
    const triggers = storedData.triggers || { created: true, updated: true, deleted: true, moved: true };

    if (!webhookUrl) {
      console.error('Webhook URL not set');
      showNotification('Error', 'Webhook URL is not set in the settings.');
      return;
    }

    if (!triggers[eventType]) {
      console.log(`Trigger for ${eventType} is disabled`);
      return;
    }

    const payload = {
      event: eventType,
      data,
      type: data.url ? 'data' : 'folder'
    };

    if (data.parentId) {
      // Retrieve full folder path and parent folder name
      try {
        const { fullPath, parentFolderName } = await getFullPathAndParentName(data.parentId);
        payload.data.folderPath = fullPath;
        payload.data.parentFolder = parentFolderName;
      } catch (error) {
        console.error('Failed to retrieve folder path:', error);
      }
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Webhook sent successfully');
    } catch (error) {
      console.error('Failed to send bookmark:', error);
      showNotification('Error', 'Failed to send bookmark data to the webhook.');
    }
  });
}

/**
* Recursively retrieves the full path of folders leading to the given bookmark
* and the name of the direct parent folder.
*
* @param {string} parentId - The ID of the parent folder.
* @returns {Promise<Object>} - A promise that resolves to an object containing
* the full path string and the direct parent folder's name.
*/
async function getFullPathAndParentName(parentId) {
const path = [];
let currentId = parentId;
let parentFolderName = '';

while (currentId) {
  const nodes = await chrome.bookmarks.get(currentId);
  if (nodes && nodes[0]) {
    path.unshift(nodes[0].title);
    if (!parentFolderName) {
      parentFolderName = nodes[0].title;
    }
    currentId = nodes[0].parentId;
  } else {
    break;
  }
}

return { fullPath: path.join('/'), parentFolderName };
}

/**
* Shows a Chrome notification.
*
* @param {string} title - The title of the notification.
* @param {string} message - The message of the notification.
*/
function showNotification(title, message) {
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icon.png',
  title: title,
  message: message,
  priority: 2
});
}

// Event listener for when a bookmark or folder is created
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
sendDataToWebhook('created', bookmark);
});

// Event listener for when a bookmark or folder is removed
chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
sendDataToWebhook('deleted', { id, parentId: removeInfo.parentId, index: removeInfo.index });
});

// Event listener for when a bookmark or folder is updated
chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
sendDataToWebhook('updated', { id, ...changeInfo });
});

// Event listener for when a bookmark or folder is moved
chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
chrome.bookmarks.get(id, (nodes) => {
  if (nodes && nodes[0]) {
    sendDataToWebhook('moved', {
      id: nodes[0].id,
      title: nodes[0].title,
      parentId: moveInfo.parentId,
      index: moveInfo.index,
      url: nodes[0].url || null // Ensure url is null if it's a folder
    });
  }
});
});

// Open options page on installation
chrome.runtime.onInstalled.addListener((details) => {
if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  chrome.runtime.openOptionsPage();
}
});