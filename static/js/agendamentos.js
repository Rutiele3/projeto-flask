const API_URL = "http://127.0.0.1:5000";


async function carregarAgendamentos() {
    try {
        const response = await fetch(`${API_URL}/api/consultas`);
        if (!response.ok) throw new Error("Erro ao carregar agendamentos.");

        const agendamentos = await response.json();
        const tbody = document.querySelector("#tabelaAgendamentos tbody");

        tbody.innerHTML = "";

        agendamentos.forEach(ag => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${ag.id}</td>
                <td>${ag.cliente}</td>
                <td>${ag.medico}</td>
                <td>${ag.data_hora}</td>
                <td>
                    ${ag.status === "agendado"
                        ? '<span class="badge bg-primary">Agendado</span>'
                        : ag.status === "concluido"
                        ? '<span class="badge bg-success">Concluído</span>'
                        : ag.status === "pendente"
                        ? '<span class="badge bg-warning text-dark">Pendente</span>'
                        : '<span class="badge bg-danger">Cancelado</span>'}
                </td>
                <td>
                    <button class="btn btn-warning btn-sm"
                        onclick="editarStatus(${ag.id}, '${ag.status}')">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm"
                        onclick="cancelar(${ag.id})">
                        Cancelar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        alert("Erro: " + err.message);
    }
}

async function cancelar(id) {
    if (!confirm("Tem certeza que deseja apagar este agendamento?")) return;

    fetch(`/api/consultas/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao deletar agendamento");
            return response.json();
        })
        .then(data => {
            alert(data.msg);
            location.reload();  // recarrega a página para atualizar a tabela
        })
        .catch(err => alert(err));

    carregarAgendamentos();
}

async function editarStatus(id, statusAtual) {

    let novoStatus;

    if (statusAtual === "agendado") {
        novoStatus = "concluido";
    } else if (statusAtual === "concluido") {
        novoStatus = "pendente";
    } else if (statusAtual === "pendente") {
        novoStatus = "cancelado";
    } else {
        novoStatus = "agendado";
    }

    const response = await fetch(`/api/consultas/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: novoStatus
        })
    });

    if (!response.ok) {
        alert("Erro ao atualizar status");
        return;
    }

   
   carregarAgendamentos();
}










































// carregarAgendamentos();