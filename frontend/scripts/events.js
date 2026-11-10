const container = document.getElementById("events-container");

const eventCard = ({ title, description, date, venue }) => `
<div class="event-card">
  <span class="date-tag">
    ${new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date))}
  </span>
  <h2>${title}</h2>
  <p class="venue">
    Venue:
    <strong>${venue}</strong>
  </p>
  <p class="event-description">
    ${description}
  </p>
</div>`;

document.addEventListener("DOMContentLoaded", async () => {
  const events = await fetch("/api/get_events").then((res) => res.json());

  if (events.length === 0) {
    container.querySelector("p").innerHTML = "No events found.";
    return;
  }

  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  container.innerHTML = events.map(eventCard).join("");
});
