/**
 * Sends bookmark data to the specified webhook URL.
 *
 * @param {string} eventType - The type of bookmark event ('created', 'updated', 'deleted').
 * @param {Object} bookmarkData - The data of the bookmark event.
 */
async function sendBookmarkToWebhook(eventType, bookmarkData) {
    chrome.storage.sync.get(['webhookUrl', 'triggers'], async (data) => {
      const webhookUrl = data.webhookUrl;
      const triggers = data.triggers || { created: true, updated: true, deleted: true };
  
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
        bookmark: bookmarkData
      };
  
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
  
  // Event listener for when a bookmark is created
  chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    if (bookmark.url) {
      sendBookmarkToWebhook('created', bookmark);
    } else {
      console.warn('Bookmark without URL detected, skipping:', bookmark);
    }
  });
  
  // Event listener for when a bookmark is removed
  chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    sendBookmarkToWebhook('deleted', { id, parentId: removeInfo.parentId, index: removeInfo.index });
  });
  
  // Event listener for when a bookmark is updated
  chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
    sendBookmarkToWebhook('updated', { id, ...changeInfo });
  });
  
  // Open options page on installation
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.runtime.openOptionsPage();
    }
  });
  