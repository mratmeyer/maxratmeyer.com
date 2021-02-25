// This is a lightweight and privacy-friendly analytics script from Shynet, a self-hosted
// analytics tool. To give you full visibility into how your data is being monitored, this
// file is intentionally not minified or obfuscated. To learn more about Shynet (and to view
// its source code), visit <https://github.com/milesmcc/shynet>.
//
// This script only sends the current URL, the referrer URL, and the page load time. That's it!

var Shynet = {
  idempotency: null,
  heartbeatTaskId: null,
  sendHeartbeat: function () {
    try {
      if (document.hidden) {
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://stats.maxnet.work/ingress/d5869121-a39c-443b-ac53-96fd87be7dd4/script.js",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(
        JSON.stringify({
          idempotency: Shynet.idempotency,
          referrer: document.referrer,
          location: window.location.href,
          loadTime:
            window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart,
        })
      );
    } catch (e) { }
  },
  newPageLoad: function () {
    if (Shynet.heartbeatTaskId != null) {
      clearInterval(Shynet.heartbeatTaskId);
    }
    Shynet.idempotency = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    Shynet.heartbeatTaskId = setInterval(Shynet.sendHeartbeat, parseInt("5000"));
    Shynet.sendHeartbeat();
  }
};

window.addEventListener("load", Shynet.newPageLoad);

