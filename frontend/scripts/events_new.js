const form = document.getElementById("events-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const res = await fetch("/api/create_event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  });

  if (!res.ok) {
    const { message } = await res.json();
    alert(message);
    return;
  }

  window.location.href = "/events";
});
