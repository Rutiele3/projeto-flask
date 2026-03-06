const API_URL = "http://127.0.0.1:5000";

const urlParams = new URLSearchParams(window.location.search);
const medicoId = urlParams.get('id');

async function carregarMedico() {
    const response = await fetch(`${API_URL}/medicos/${medicoId}`);
    if (!response.ok) throw new Error("Erro ao carregar o médico.");

    const medico = await response.json();

    // se backend retornar objeto direto
    document.getElementById('medico-nome').value = medico.nome;
    document.getElementById('medico-especialidade').value = medico.especialidade;
    document.getElementById('medico-crm').value = medico.crm;
}

async function atualizarMedico() {
    let nome = document.getElementById('medico-nome').value;
    let especialidade = document.getElementById('medico-especialidade').value;
    let crm = document.getElementById('medico-crm').value;

    const response = await fetch(`${API_URL}/medicos/${medicoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            especialidade: especialidade,
            crm: crm
        })
    });

    if (!response.ok) {
        alert("Erro ao atualizar médico.");
        return;
    }

    window.location.href = 'medicos.html';
}

document.addEventListener('DOMContentLoaded', carregarMedico);