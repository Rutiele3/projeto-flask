const API_URL = "http://127.0.0.1:5000";
console.log("Arquivo criarMedico.js carregado");

async function criarMedico() {
    console.log("Função criarMedico chamada");
    try {
        let novoNome = document.getElementById('medico-nome').value;
        let novaEspecialidade = document.getElementById('medico-especialidade').value;
        let novoCRM = document.getElementById('medico-crm').value;

        const response = await fetch(`${API_URL}/api/medicos`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                nome: novoNome, 
                especialidade: novaEspecialidade, 
                crm: novoCRM})
        });
       

        if (response.ok) {
            alert("Médico salvo!");
            window.location.href = "/medicos-page"; 
        } else {
            alert("Erro ao criar médico.");
        };
    } catch (err) {
        
        alert("Erro: " + err.message);
    }
}