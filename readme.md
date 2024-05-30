# Bookmark Webhook Trigger Extension

This Chrome extension triggers a predefined webhook whenever a bookmark is created, updated, or deleted. The webhook payload includes information about the bookmark. You can configure the webhook URL and select which bookmark actions to trigger.

## Features

- Trigger a webhook on bookmark creation, update, or deletion.
- Configurable webhook URL.
- Select which bookmark actions to trigger.
- Displays notifications on errors.

## Installation

1. Clone the repository or download the ZIP file and extract it.
   ```bash
   git clone https://github.com/yourusername/bookmark-webhook-trigger.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on "Load unpacked" and select the directory where you cloned or extracted the extension.

## Configuration

1. Once the extension is installed, it will open the options page automatically.
2. Enter the webhook URL where you want to send the bookmark data.
3. Select the bookmark actions you want to trigger the webhook (created, updated, deleted).
4. Click "Save" to store the settings.

## Usage

The extension listens for bookmark events and sends a POST request to the configured webhook URL with the following JSON payload:

### Sample Payload for Bookmark Created
```json
{
  "event": "created",
  "bookmark": {
    "title": "Callinetic",
    "url": "https://www.callinetic.be/en",
    "id": "123",
    "parentId": "0",
    "dateAdded": 1627384852000
  }
}
```

### Sample Payload for Bookmark Updated
```json
{
  "event": "updated",
  "bookmark": {
    "id": "123",
    "title": "Callinetic - Updated",
    "url": "https://www.callinetic.be/en"
  }
}
```

### Sample Payload for Bookmark Deleted
```json
{
  "event": "deleted",
  "bookmark": {
    "id": "123",
    "parentId": "0",
    "index": 5
  }
}
```

## Example Use Case with Make.com

[Make](https://www.make.com) allows you to create automation workflows. Here’s how you can use this extension to send bookmark events to a Make webhook:


> [!TIP]
> **Get Started with Make**:
New users can get 10,000 free operations for the first month by signing up with this [affiliate link](https://www.make.com/en?pc=callinetic).

1. **Create a Webhook in Make**:
   - Log in to your Make account.
   - Create a new scenario.
   - Add a new module and search for "Webhook".
   - Select the "Custom Webhook" option.
   - Copy the provided webhook URL.
   - Start running your scenario clicking the "Run Once" button

2. **Configure the Extension**:
   - Open the extension's options page.
   - Paste the Make webhook URL into the webhook URL field.
   - Select the actions (created, updated, deleted) you want to trigger the webhook.
   - Click "Save".

3. **Trigger an Event**:
   - Create, update, or delete a bookmark in Chrome.
   - The extension will send a POST request to the Make webhook with the bookmark data.

4. **Verify in Make**:
   - Go back to your scenario in Make.
   - You should see the webhook being triggered with the bookmark data.
   - Use this data to perform further actions in your Make scenario (e.g., store the data in a Google Sheet, send a notification, etc.).

![Example Use Case with Make](assets/bookmark-syncer-integrated-with-make.gif)

## Error Handling

If the extension fails to send the bookmark data to the webhook, it will display a Chrome notification with the error message.

## Development

To contribute to the development of this extension:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them with descriptive messages.
   ```bash
   git commit -m "Description of the feature or bugfix"
   ```
4. Push your changes to your forked repository.
   ```bash
   git push origin feature-name
   ```
5. Create a pull request on the original repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This extension uses the [Tailwind CSS](https://tailwindcss.com/) framework for styling the options page.
- Icon generated using ChatGPT and DALL-E by OpenAI.