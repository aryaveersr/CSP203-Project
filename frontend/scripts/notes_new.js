const form = document.getElementById("notes-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const res = await fetch("/api/create_note", {
    method: "POST",
    body: new FormData(form),
  });

  if (!res.ok) {
    const { message } = await res.json();
    alert(message);
    return;
  }

  window.location.href = "/notes";
});
