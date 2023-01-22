# HackTheBox Team Activity

> This is a simple Discord Bot that checks the activity of a defined team and posts a nice embed if a new activity is detected.

## Contribution:
I'd love if someone wrote a way to refresh the token with the refresh_token,
as re-fetching with email and password seems stupid.
Any method of refreshing wasn't documented, so I didn't bother trying to do it x)
If your PR is sensible, I'll merge it. If not, I'll let you know why not and request changes <3

## Usage:
Just fill out the placeholders a the top of the file and run the thingy.

publicKey: PUBLICKEY_HERE
> The Discord Application's Public Key.

token: TOKEN_HERE
> The Discord Application's Token.

endpoint: ENDPOINT_HERE
> The Discord Application's Interactions Endpoint.

port: PORT_HERE
> The Port on your Host that the endpoint is listening on.

channelID = CHANNEL_ID_HERE
> The channel you wish the embeds to be sent.

teamID = TEAM_ID_HERE
> The Hack The Box team you wish to monitor (idk if you can if you aren't a part of it.)

email = HTB_EMAIL_HERE
> Hack The Box Email.

password = HTB_PASSWORD_HERE
> Hack The Box Password.

"sqlite://FILE_PATH_HERE"
> The location to store a local sqlite file, to keep track of the latest activity time.
