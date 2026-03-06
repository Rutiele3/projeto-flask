const API_URL = "http://127.0.0.1:5000";

async function carregarTodosUsuarios() {
    const tbody = document.querySelector("#tabelaUsuarios tbody");

    if (!tbody) return;

    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error("Erro ao carregar usuários");

        const usuarios = await response.json();

        tbody.innerHTML = "";

        usuarios.forEach(user => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nome}</td>
                        <td>${user.email}</td>
                        <td>
                            <a class="btn btn-warning" href="updateUsuario.html?id=${user.id}" role="button"">Editar</a>
                            <a class="btn btn-danger" onclick="deletarUsuario(${user.id})" role="button"">Apagar</a>
                        </td>
                    `;

            tbody.appendChild(tr);
        });
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

async function deletarUsuario(userID) {
    const confirmacao = confirm("Tem certeza que deseja deletar este usuário?");

    if (!confirmacao) return;
    
    try {
        const response = await fetch(`${API_URL}/usuarios/${userID}`, {
            method: "DELETE",

        });

        if (!response.ok) {

            throw new Error("Erro ao deletar o usuário.")
        }

        alert("Usuário deletado com sucesso!");
        window.location.href = '/';

    } catch (error) {
        console.error(error);
        alert("Erro ao deletar o usuário: ");
        return;
    }

}

carregarTodosUsuarios();