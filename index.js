const {get, post} = require("axios");
const {Client, Embed} = require("discord-http-interactions");
const Keyv = require("keyv");

const client = new Client({
  publicKey: PUBLICKEY_HERE,
  token: TOKEN_HERE,
  endpoint: ENDPOINT_HERE,
  port: PORT_HERE
});
const channelID = CHANNEL_ID_HERE;
const teamID = TEAM_ID_HERE;
const email = HTB_EMAIL_HERE;
const password = HTB_PASSWORD_HERE:

const base = "https://www.hackthebox.eu/api/v4";
let apitoken;

const db = new Keyv("sqlite://FILE_PATH_HERE");
db.on("error", e => console.log("Connection Error", e));

client.on("ready",async ()=>{
    console.log("Ready!");
    apitoken = await getToken();
    const latest = await db.get("latest");
    if(latest === undefined){
        await db.set("latest","2023-01-22T10:00:00.000000Z");
    }
    check();
    setInterval(check,1000*60*5);
});

client.login();

async function check(){
    console.log("Checking team activity.");
    await checkToken();
    const latest = await db.get("latest");
    get(`${base}/team/activity/${teamID}`,{headers: {"Authorization": `Bearer ${apitoken}`}}).then(async d => {
        const arr = d.data;
        const index = arr.indexOf(arr.find(x => x.date === latest));
        if(index !== 0){
            console.log("Sending new completions");
            if(index === -1) index = arr.length;
            for(let i = index-1; i >= 0; i--){
                const data = arr[i];
                let description;
                let color;
                switch(data.object_type){
                    case "machine":
                        description = `Gained ${data.type.toUpperCase()} on [MACHINE: ${data.name.toUpperCase()}](https://app.hackthebox.com/${data.object_type}s/${data.id}) and earned ${data.points} points!`;
                        color = data.type === "root" ? 0xff0000: 0x3636ff;
                        break;
                    case "challenge":
                        description = `Completed [${data.type.toUpperCase()}: ${data.name.toUpperCase()}](https://app.hackthebox.com/${data.object_type}s/${data.id}) and earned ${data.points} points!`;
                        color = 0xeecc11;
                        break;
                    default:
                        description = `Completed [${data.type.toUpperCase()}: ${data.name.toUpperCase()}](https://app.hackthebox.com/${data.object_type}s/${data.id}) and earned ${data.points} points!`;
                        color = 0x58f260;
                }
                client.newMessage(channelID,{
                    embeds: [
                        new Embed()
                            .setAuthor(data.user.name, `https://app.hackthebox.com/users/${data.user.id}`,`https://www.hackthebox.com${data.user.avatar_thumb}`)
                            .setDescription(description)
                            .setTimestamp(data.date)
                            .setThumbnail(`https://www.hackthebox.com${data.machine_avatar}`)
                            .setColor(color)
                    ]
                }).catch(e => console.log(e));
            }
            await db.set("latest",arr[0].date);
        } else {
            console.log("No new completions.");
        }
    });
}

function getToken(){
    return new Promise(res => {
        post(`${base}/login`,{ email, password, remember: true }).then(d => {
            console.log("Token recieved.");
            res(d.data.message.access_token);
        });
    });
}

function checkToken(){
    return new Promise(async res => {
        const data = parseJwt(apitoken);
        if(data.exp - Date.now()/1000 <= 0){
            console.log("Token expired, fetching a new one.");
            apitoken = await getToken();
        }
        res();
    });
}

// Copied from: https://github.com/Propolisa/Seven/blob/94b12be2d30bd5ef1a278f25d95630f89810770b/modules/api.js#L422
function parseJwt(token) {
    if (token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const buff = new Buffer.from(base64, "base64");
            const payloadinit = buff.toString("ascii");
            const payload = JSON.parse(payloadinit);
            return payload;
        } catch (e) {
            console.error(e);
            return null;
        }
    } else {
        return null;
    }
}
