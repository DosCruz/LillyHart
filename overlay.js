(function() {
    const ua = (navigator.userAgent || navigator.vendor || window.opera || "").toLowerCase();
    const ref = (document.referrer || "").toLowerCase();

    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);

    const isTikTok =
        ua.includes("tiktok") ||
        ua.includes("ttwebview") ||
        ua.includes("trill") ||
        ua.includes("musical.ly") ||
        ua.includes("aweme") ||
        ua.includes("bytedancewebview");
        ref.includes("tiktoklinksafety.com");

    const isInstagram = ua.includes("instagram");
    const isFacebook = ua.includes("fban") || ua.includes("fbav");

    function showOverlay() {
        if (document.getElementById("openBrowserOverlay")) return; // avoid duplicates
        const overlay = document.createElement("div");
        overlay.id = "openBrowserOverlay";
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            color: "#F5F6F9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Montserrat', sans-serif",
            textAlign: "center",
            zIndex: "999999",
            padding: "40px 20px",
            boxSizing: "border-box",
        });

        const msg = document.createElement("div");
        msg.style.maxWidth = "90%";
        msg.style.lineHeight = "1.5";
        msg.style.fontSize = "16px";
        msg.innerHTML = `
            <h2 style="margin-bottom:15px; font-size:22px;">⚠️ Open in External Browser</h2>
            <p style="margin-bottom:20px;">This page works best in Safari or Chrome.</p>
            <p style="margin-bottom:30px;">Tap the <strong>•••</strong>, then choose <strong>"Open in Browser"</strong>.</p>
        `;

        overlay.appendChild(msg);
        document.body.appendChild(overlay);
    }

    // Run as soon as possible
    const runDetection = () => {
        try {
            if (isAndroid) {
                if (isTikTok) {
                    showOverlay();
                } else if (isInstagram || isFacebook) {
                    window.location.href =
                        "intent://" + window.location.host + window.location.pathname +
                        "#Intent;scheme=https;package=com.android.chrome;end";
                }
            } else if (isIOS) {
                // Safari toolbar check fallback
                const toolbarMissing = window.innerHeight >= screen.height * 0.98;
                const inAppGuess = !window.navigator.standalone && toolbarMissing;

                if (isTikTok || isInstagram || isFacebook || inAppGuess) {
                    showOverlay();
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Run early and again after delay (TikTok may delay DOM creation)
    runDetection();
    document.addEventListener("DOMContentLoaded", runDetection);
    setTimeout(runDetection, 1000);
    setTimeout(runDetection, 3000);
})();