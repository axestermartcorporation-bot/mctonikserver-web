const express = require("express");
const path = require("path");
const { status } = require("minecraft-server-util");

const app = express();
const PORT = 3000;

const WEB_ROOT = path.join(__dirname, "..");

const MINECRAFT_HOST = "McTonikServer.aternos.me";
const MINECRAFT_PORT = 25565;

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(
        path.join(WEB_ROOT, "index.html")
    );
});

app.use(
    express.static(WEB_ROOT)
);

app.get("/api/server", async (req, res) => {

    try {

        const result = await status(
            MINECRAFT_HOST,
            MINECRAFT_PORT,
            {
                timeout: 5000
            }
        );

        if (
            !result ||
            !result.version ||
            !result.players
        ) {
            throw new Error(
                "Neplatná odpověď Minecraft serveru"
            );
        }

        const versionName =
            result.version.name || "";

        // Aternos může při vypnutém serveru
        // vrátit odpověď s textem "Offline".
        if (
            versionName.includes("Offline") ||
            versionName.includes("offline")
        ) {
            throw new Error(
                "Aternos server je offline"
            );
        }

        const onlinePlayers =
            Number(result.players.online) || 0;

        const maxPlayers =
            Number(result.players.max) || 0;

        res.json({
            name: "McTonikServer",
            status: "online",
            ip: MINECRAFT_HOST,
            port: MINECRAFT_PORT,
            version: versionName,
            players: onlinePlayers,
            maxPlayers: maxPlayers
        });

    } catch (error) {

        console.log(
            "McTonikServer je OFFLINE."
        );

        res.json({
            name: "McTonikServer",
            status: "offline",
            ip: MINECRAFT_HOST,
            port: MINECRAFT_PORT,
            version: null,
            players: 0,
            maxPlayers: 0
        });

    }

});

app.listen(PORT, () => {

    console.log("");

    console.log(
        "======================================"
    );

    console.log(
        "      McTonikServer Web Server"
    );

    console.log(
        "======================================"
    );

    console.log(
        "Web: http://localhost:" + PORT
    );

    console.log(
        "Minecraft: " +
        MINECRAFT_HOST +
        ":" +
        MINECRAFT_PORT
    );

    console.log(
        "======================================"
    );

    console.log("");

});
