
document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById("complaints-body");
    const message = document.getElementById("dashboard-message");
    const search = document.getElementById("search-input");
    const filter = document.getElementById("status-filter");
    const refresh = document.getElementById("refresh-btn");
    const logout = document.getElementById("logout-btn");

    let complaints = [];

    function showMessage(text, error = false) {
        message.textContent = text;
        message.style.color = error ? "#dc2626" : "#475569";
    }

    async function api(url, options = {}) {
        const response = await fetch(url, {
            credentials: "same-origin",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            }
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 401) {
            window.location.href = "/";
            throw new Error("Your session has expired.");
        }

        if (!response.ok) {
            throw new Error(
                result.message || "The request failed."
            );
        }

        return result;
    }

    function updateStats(stats) {
        document.getElementById("total-count").textContent =
            stats.total;
        document.getElementById("pending-count").textContent =
            stats.pending;
        document.getElementById("progress-count").textContent =
            stats.in_progress;
        document.getElementById("resolved-count").textContent =
            stats.resolved;
    }

    function makeCell(value) {
        const td = document.createElement("td");
        td.textContent = value ?? "";
        return td;
    }

    function renderComplaints() {
        const query = search.value.trim().toLowerCase();
        const selectedStatus = filter.value;

        const filtered = complaints.filter(item => {
            const matchesSearch = [
                item.id,
                item.subject,
                item.description,
                item.username
            ].some(value =>
                String(value ?? "").toLowerCase().includes(query)
            );

            const matchesStatus =
                selectedStatus === "All" ||
                item.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        body.replaceChildren();

        if (filtered.length === 0) {
            const tr = document.createElement("tr");
            const td = makeCell("No complaints found.");
            td.colSpan = 7;
            tr.appendChild(td);
            body.appendChild(tr);
            return;
        }

        filtered.forEach(item => {
            const tr = document.createElement("tr");

            tr.appendChild(makeCell(`#${item.id}`));
            tr.appendChild(makeCell(item.subject));
            tr.appendChild(makeCell(item.description));
            tr.appendChild(makeCell(item.username));
            tr.appendChild(makeCell(item.created_at));

            const statusCell = document.createElement("td");
            const badge = document.createElement("span");
            badge.className =
                "status status-" +
                item.status.toLowerCase().replaceAll(" ", "-");
            badge.textContent = item.status;
            statusCell.appendChild(badge);
            tr.appendChild(statusCell);

            const actionCell = document.createElement("td");
            const select = document.createElement("select");
            select.className = "status-select";
            select.setAttribute(
                "aria-label",
                `Update complaint ${item.id} status`
            );

            ["Pending", "In Progress", "Resolved", "Rejected"]
                .forEach(status => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status;
                    option.selected = status === item.status;
                    select.appendChild(option);
                });

            select.addEventListener("change", async () => {
                select.disabled = true;

                try {
                    await api(
                        `/api/admin/complaints/${item.id}`,
                        {
                            method: "PATCH",
                            body: JSON.stringify({
                                status: select.value
                            })
                        }
                    );

                    showMessage(`Complaint #${item.id} updated.`);
                    await loadDashboard();
                } catch (error) {
                    showMessage(error.message, true);
                    await loadDashboard();
                } finally {
                    select.disabled = false;
                }
            });

            actionCell.appendChild(select);
            tr.appendChild(actionCell);
            body.appendChild(tr);
        });
    }

    async function loadDashboard() {
        refresh.disabled = true;
        showMessage("Loading complaints...");

        try {
            const result = await api("/api/admin/complaints");
            complaints = result.complaints;
            updateStats(result.stats);
            renderComplaints();
            showMessage("Dashboard updated successfully.");
        } catch (error) {
            showMessage(error.message, true);
        } finally {
            refresh.disabled = false;
        }
    }

    search.addEventListener("input", renderComplaints);
    filter.addEventListener("change", renderComplaints);
    refresh.addEventListener("click", loadDashboard);

    logout.addEventListener("click", async () => {
        logout.disabled = true;

        try {
            await api("/api/logout", { method: "POST" });
            window.location.href = "/";
        } catch (error) {
            showMessage(error.message, true);
            logout.disabled = false;
        }
    });

    loadDashboard();
});
