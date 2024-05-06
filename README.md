# W1ndE-Bot
This is a Discord bot coded in Node.js & Discord.js. I am currently still slowly working on it.
# Features
- Default moderation tools (Ban, Kick, Timeout).
- Welcome message and Auto Role when people join a Guild.
- Level & XP system.
# Features work in progress
- Twitch integration (Display notification when someone goes live on Twitch).
- Youtube integration (Display notification when a new video is posted on Youtube by someone).
# Branches
- `main` branch is where the current full release is. This is usually only tested and working commands and features.
- `new-feature-testing` branch is where work in progress features are created and tested before publishing to `main` branch.
# Example cfg.json file:
`{

    "token": "YOUR_BOT_TOKEN",

    "testbot_token": "YOUR_TEST_BOT_TOKEN(IF_APPLICABLE)",

    "bot_id": "YOUR_BOTS_ID",

    "testserver": "TEST_SERVER_ID(FOR_TESTING_PURPOSES)",

    "creator_id": "BOT_OWNER_ID",

    "devs": ["DEV_IDS_FOR_COMMAND_TESTING"],

    "mongopass": "PASSWORD_FOR_YOUR_DATABASE",

    "MONGODB_URI": "URI_FOR_YOUR_DATABASE",

    "twtichclient_id": "YOUR_TWITCH_CLIENTID",

    "twitchclient_secret": "YOUR_TWITCH_CLIENTSECRET",
    
}`