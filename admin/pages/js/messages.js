// ==============================
// ECOQUEST ADMIN - MESSAGES
// ==============================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let allMessages = [];

// ==============================
// Load Messages
// ==============================

async function loadMessages() {

    try {

        const response = await fetch("http://localhost:5000/api/messages", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch messages");
        }

        allMessages = await response.json();

        // Statistics
        document.getElementById("messageCount").textContent = allMessages.length;

        const today = new Date().toDateString();

        const todayCount = allMessages.filter(message => {

            return new Date(message.createdAt).toDateString() === today;

        }).length;

        document.getElementById("todayMessages").textContent = todayCount;

        renderMessages(allMessages);

    } catch (error) {

        console.error(error);

        document.getElementById("messageTable").innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;color:red;">
                    Failed to load messages.
                </td>
            </tr>
        `;

    }

}

// ==============================
// Render Messages
// ==============================

function renderMessages(messages) {

    const table = document.getElementById("messageTable");

    table.innerHTML = "";

    if (messages.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No messages found.
                </td>
            </tr>
        `;

        return;

    }

    messages.forEach(message => {

        const initial = message.name
            ? message.name.charAt(0).toUpperCase()
            : "?";

        table.innerHTML += `
            <tr>

                <td>

                    <div class="sender">

                        <div class="avatar">
                            ${initial}
                        </div>

                        <div class="sender-info">

                            <h4>${message.name}</h4>

                            <span>${message.email}</span>

                        </div>

                    </div>

                </td>

                <td>
                    ${message.subject || "<em>No Subject</em>"}
                </td>

                <td>
                    ${new Date(message.createdAt).toLocaleString()}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="view"
                            onclick='viewMessage(
                                ${JSON.stringify(message.name)},
                                ${JSON.stringify(message.email)},
                                ${JSON.stringify(message.subject || "No Subject")},
                                ${JSON.stringify(message.message)}
                            )'>

                            <i class="fa-solid fa-eye"></i>

                        </button>

                        <button
                            class="delete"
                            onclick="deleteMessage(${message.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>
        `;

    });

}

// ==============================
// Search
// ==============================

document.getElementById("searchMessage").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const filtered = allMessages.filter(message => {

        return (

            message.name.toLowerCase().includes(value) ||

            message.email.toLowerCase().includes(value) ||

            (message.subject || "").toLowerCase().includes(value)

        );

    });

    renderMessages(filtered);

});

// ==============================
// View Message
// ==============================

function viewMessage(name, email, subject, message) {

    document.getElementById("modalName").textContent = name;

    document.getElementById("modalEmail").textContent = email;

    document.getElementById("modalMessage").innerHTML = `
        <strong>Subject:</strong><br>
        ${subject}
        <br><br>

        <strong>Message:</strong><br>
        ${message}
    `;

    document.getElementById("messageModal").style.display = "flex";

}

// ==============================
// Close Modal
// ==============================

document.getElementById("closeModal").onclick = () => {

    document.getElementById("messageModal").style.display = "none";

};

window.onclick = (e) => {

    if (e.target.id === "messageModal") {

        document.getElementById("messageModal").style.display = "none";

    }

};

// ==============================
// Delete Message
// ==============================

async function deleteMessage(id) {

    const confirmDelete = confirm("Delete this message?");

    if (!confirmDelete) return;

    alert(
        "Backend delete endpoint has not been created yet.\n\nNext we'll create DELETE /api/messages/:id."
    );

}

// ==============================
// Logout
// ==============================

document.getElementById("logout").addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "login.html";

});

// ==============================
// Start
// ==============================

loadMessages();