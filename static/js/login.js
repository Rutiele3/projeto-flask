const API_URL = "http://127.0.0.1:5000";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, senha: senha })
    });

    if (response.ok) {
        window.location.href = "/";
    } else {
        alert("Usuário não encontrado!");
    }
});