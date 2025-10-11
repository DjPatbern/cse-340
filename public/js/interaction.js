const invId = document.querySelector(".interaction-section")?.dataset.invId;
document.addEventListener("DOMContentLoaded", () => {
  const currentUserId =
    document.getElementById("current-user-id")?.value || null;
  const likeBtn = document.getElementById("like-btn");
  const likeCount = document.getElementById("like-count");
  const commentList = document.getElementById("comment-list");
  const commentForm = document.getElementById("comment-form");

  /* ---------- LIKE TOGGLE ---------- */
  likeBtn.addEventListener("click", async () => {
    const res = await fetch("/interaction/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inv_id: invId }),
    });
    const data = await res.json();
    if (data.success) {
      likeBtn.textContent = data.liked ? "Unlike" : "Like";
      likeCount.textContent = data.likeCount;
    }
  });

  /* ---------- LOAD COMMENTS ---------- */
  async function loadComments() {
    const res = await fetch(`/interaction/${invId}/comments`);
    const data = await res.json();
    commentList.innerHTML = "";
    if (data.success) {
      data.comments.forEach((c) => {
        const div = document.createElement("div");
        div.dataset.commentId = c.comment_id;

        const isOwner = currentUserId && Number(currentUserId) === c.account_id;

        div.innerHTML = `
          <p class="font-medium">${c.account_firstname} ${
          c.account_lastname
        }</p>
          <p class="comment-content">${c.content}</p>
          <small class="text-gray-500">${new Date(
            c.created_at
          ).toLocaleString()}</small>
          ${
            isOwner
              ? `
            <div class="mt-1">
              <button class="edit-comment-btn">Edit</button>
              <button class="delete-comment-btn">Delete</button>
            </div>
          `
              : ""
          }
        `;
        commentList.appendChild(div);
      });

      document
        .querySelectorAll(".edit-comment-btn")
        .forEach((btn) => btn.addEventListener("click", handleEditComment));
      document
        .querySelectorAll(".delete-comment-btn")
        .forEach((btn) => btn.addEventListener("click", handleDeleteComment));
    }
  }

  /* ---------- ADD COMMENT ---------- */
  if (commentForm) {
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = document.getElementById("comment-input").value;
      const res = await fetch("/interaction/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inv_id: invId, content }),
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById("comment-input").value = "";
        loadComments();
      }
    });
  }

  /* ---------- EDIT COMMENT ---------- */
  async function handleEditComment(e) {
    const commentDiv = e.target.closest("div[data-comment-id]");
    const contentP = commentDiv.querySelector(".comment-content");
    const oldContent = contentP.textContent;
    const commentId = commentDiv.dataset.commentId;

    commentDiv.innerHTML += `
      <textarea class="edit-area">${oldContent}</textarea>
      <button class="save-edit-btn">Save</button>
      <button class="cancel-edit-btn">Cancel</button>
    `;

    commentDiv
      .querySelector(".save-edit-btn")
      .addEventListener("click", async () => {
        const newContent = commentDiv.querySelector(".edit-area").value.trim();
        if (!newContent) return alert("Comment cannot be empty.");
        const res = await fetch("/interaction/comment", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment_id: commentId, content: newContent }),
        });
        const data = await res.json();
        if (data.success) loadComments();
      });

    commentDiv
      .querySelector(".cancel-edit-btn")
      .addEventListener("click", loadComments);
  }

  /* ---------- DELETE COMMENT ---------- */
  async function handleDeleteComment(e) {
    const commentDiv = e.target.closest("div[data-comment-id]");
    const commentId = commentDiv.dataset.commentId;
    if (confirm("Are you sure you want to delete this comment?")) {
      const res = await fetch("/interaction/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: commentId }),
      });
      const data = await res.json();
      if (data.success) loadComments();
    }
  }

  /* ---------- INIT ---------- */
  loadComments();
});
