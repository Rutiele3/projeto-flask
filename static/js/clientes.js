const API_URL = "http://127.0.0.1:5000";

async function carregarClientes() {
    try {
        const response = await fetch(`${API_URL}/api/clientes`);
        if (!response.ok) throw new Error("Erro ao carregar clientes.");

        const clientes = await response.json();
        const tbody = document.querySelector("#tabelaClientes tbody");

        tbody.innerHTML = "";

        clientes.forEach(cliente => {
            const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.telefone}</td>
                    <td>
                        <a class="btn btn-warning" href="/clientes/${cliente.id}/editar">Editar</a>
                        <a class="btn btn-danger" onclick="deletarCliente(${cliente.id})" role="button">Apagar</a>
                    </td>
                `;

            tbody.appendChild(tr);
        });
    } catch (err) {
        alert("Falha: " + err.message);
    }
}

async function deletarCliente(Id) {
    try{
        if (!confirm("Deseja realmente deletar este cliente?")) return;

        const response = await fetch(`${API_URL}/api/clientes/${Id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
        
        if (response.ok){
            alert("Cliente deletado com sucesso!");
            carregarClientes();
        }else{
            alert("Erro ao deletar cliente.");
        }

        carregarClientes();
    }catch (err) {
    alert("Erro: " + err.message);
    }
}

carregarClientes();