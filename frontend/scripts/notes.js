const container = document.getElementById("notes-container");

const notesCard = ({
  code,
  title,
  author,
  content,
  uploaded_at,
  attachments,
}) => `
<div class="note-card">
  <span class="course-tag">${code}</span>
  <h2>${title}</h2>
  <p class="author">
    Uploaded by
    <strong>${author}</strong> &bull;
    ${new Intl.DateTimeFormat("en-US", {}).format(new Date(uploaded_at))}
  </p>
  <p class="note-content">
    ${content}
  </p>
  <div class="attachments">
    ${attachments
      .map(
        (attachment) =>
          `<a href="/api/download_attachment?id=${attachment.id}" download>${attachment.filename} ↓</a>`,
      )
      .join("")}
  </div>
</div>`;

document.addEventListener("DOMContentLoaded", async () => {
  const notes = await fetch("/api/get_notes").then((res) => res.json());
  console.log(notes);

  if (notes.length === 0) {
    container.querySelector("p").innerHTML = "No notes found.";
    return;
  }

  container.innerHTML = notes.map(notesCard).join("");
});
