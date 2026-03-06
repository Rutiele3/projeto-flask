const API_URL = "http://127.0.0.1:5000";
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

async function carregarUsuario() {
    const response = await fetch(`${API_URL}/usuarios/${userId}`);
    if (!response.ok) throw new Error("Erro ao carregar o usuário.")

    const usuario = await response.json();

    document.getElementById('usuario-nome').value = usuario[0].nome;
    document.getElementById('usuario-email').value = usuario[0].email;
}
async function atualizarUsuario() {
    novoNome = document.getElementById('usuario-nome').value
    novoEmail = document.getElementById('usuario-email').value

    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome: novoNome, email: novoEmail })
    });

    if (!response.ok) throw new Error("Erro ao atualizar o usuário.")

    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    carregarUsuario(userId)
})

