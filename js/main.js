const copyButton = document.getElementById("copy-ip");

copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText("McTonikServer.aternos.me");

    copyButton.textContent = "IP zkopírována!";

    setTimeout(() => {
        copyButton.textContent = "Kopírovat IP";
    }, 2000);
});


const statusContainer =
    document.querySelector(".server-status");

const statusLight =
    document.querySelector(".status-light");

const statusText =
    document.querySelector(".status-text");

const playerCount =
    document.querySelector(".player-count");


async function loadServer() {

    try {

        const response = await fetch(
            "/api/server",
            {
                cache: "no-store"
            }
        );

        const server =
            await response.json();

        console.log(server);


        const online =
            server.status === "online";


        // ONLINE / OFFLINE

        if (statusText) {

            statusText.textContent =
                online
                    ? "ONLINE"
                    : "OFFLINE";

        }


        // ZELENÁ / ČERVENÁ TEČKA

        if (statusLight) {

            statusLight.style.background =
                online
                    ? "#45ff7a"
                    : "#ff4545";

            statusLight.style.boxShadow =
                online
                    ? "0 0 10px #45ff7a"
                    : "0 0 10px #ff4545";

        }


        // POČET HRÁČŮ

        if (playerCount) {

            playerCount.textContent =
                online
                    ? `${server.players} / ${server.maxPlayers} hráčů`
                    : "0 / 0 hráčů";

        }

    }

    catch (error) {

        console.error(
            "Nepodařilo se zjistit stav serveru:",
            error
        );


        if (statusText) {
            statusText.textContent = "OFFLINE";
        }


        if (statusLight) {

            statusLight.style.background =
                "#ff4545";

            statusLight.style.boxShadow =
                "0 0 10px #ff4545";

        }


        if (playerCount) {
            playerCount.textContent =
                "0 / 0 hráčů";
        }

    }

}


// První kontrola ihned

loadServer();


// Aktualizace každých 15 sekund

setInterval(
    loadServer,
    15000
);
