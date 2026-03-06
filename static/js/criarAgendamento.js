async function criarAgendamento(event) {
    event.preventDefault();

    const data_hora = document.getElementById("data").value + " " + document.getElementById("horario").value;

    const medico_id = document.getElementById("medico_id").value;
    const cliente_id = document.getElementById("cliente_id").value;

    const response = await fetch("/api/consultas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data_hora: data_hora,
            medico_id: medico_id,
            cliente_id: cliente_id
        })
    });

    if (!response.ok) {
        alert("Erro ao criar agendamento");
        return;
    }

    const result = await response.json();
    alert(result.message);

    window.location.href = "/agendamentos";
}