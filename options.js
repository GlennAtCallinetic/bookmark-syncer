document.addEventListener('DOMContentLoaded', () => {
    const webhookUrlInput = document.getElementById('webhookUrl');
    const triggerCreatedInput = document.getElementById('triggerCreated');
    const triggerUpdatedInput = document.getElementById('triggerUpdated');
    const triggerDeletedInput = document.getElementById('triggerDeleted');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
  
    // Load saved settings
    chrome.storage.sync.get(['webhookUrl', 'triggers'], (data) => {
      if (data.webhookUrl) {
        webhookUrlInput.value = data.webhookUrl;
      }
      if (data.triggers) {
        triggerCreatedInput.checked = data.triggers.created;
        triggerUpdatedInput.checked = data.triggers.updated;
        triggerDeletedInput.checked = data.triggers.deleted;
      }
    });
  
    // Save settings
    saveBtn.addEventListener('click', () => {
      const webhookUrl = webhookUrlInput.value;
      const triggers = {
        created: triggerCreatedInput.checked,
        updated: triggerUpdatedInput.checked,
        deleted: triggerDeletedInput.checked,
      };
      chrome.storage.sync.set({ webhookUrl, triggers }, () => {
        status.textContent = 'Settings saved!';
        setTimeout(() => { status.textContent = ''; }, 2000);
      });
    });
  });
  