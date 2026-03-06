const API_URL = "http://127.0.0.1:5000";

async function carregarMedicos() {
    try {
        const response = await fetch(`${API_URL}/api/medicos`);
        if (!response.ok) throw new Error("Erro ao carregar médicos.");
        const medicos = await response.json();
        
        const tbody = document.querySelector("#tabelaMedicos tbody");
        tbody.innerHTML = "";

        medicos.forEach(medico => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                        <td>${medico.id}</td>
                        <td>${medico.nome}</td>
                        <td>${medico.especialidade}</td>
                        <td>${medico.crm}</td>
                        
                        <td>
                            <a class="btn btn-warning" href="updateMedico.html?id=${medico.id}" role="button">Editar</a>
                            <a class="btn btn-danger" onclick="deletarMedico(${medico.id})" role="button">Apagar</a>
                        </td>
                    `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        alert("Falha: " + err.message);
    }
}

async function deletarMedico(medicoId) {
    try {
        const response = await fetch(`${API_URL}/api/medicos/${medicoId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Erro ao deletar o médico.")

        carregarMedicos();
    } catch (err) {
        alert("Falha: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", carregarMedicos);