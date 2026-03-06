const API_URL = "http://127.0.0.1:5000";

async function CarregarUsuariosPaciente() {
    try {
        const responseUsuarios = await fetch(`${API_URL}/usuario_id`);
        const responseMedicos = await fetch(`${API_URL}/medico_id`);
        if (!responseUsuarios.ok) throw new Error("Erro ao carregar os usuarios.");
        if (!responseMedicos.ok) throw new Error("Erro ao carregar os medicos.");
        const usuarios = await responseUsuarios.json();
        const usuarioSelect = document.getElementById('usuario_id');

        usuarios.forEach(user => {
            const optionUsuarios = document.createElement('option');
            optionUsuarios.value = user.id;
            optionUsuarios.textContent = `${user.nome}`.trim();
            usuarioSelect.appendChild(optionUsuarios);
        });

        const responseProdutos = await fetch(`${API_URL}/produtos`);
        if (!responseProdutos.ok) throw new Error("Erro ao carregar os produtos.");
        
        const produtos = await responseProdutos.json();
        const produtoSelect = document.getElementById('produto_id');

        produtos.forEach(produto => {
            const optionProdutos = document.createElement('option');
            optionProdutos.value = produto.id;
            optionProdutos.textContent = `${produto.nome}`.trim();
            produtoSelect.appendChild(optionProdutos);
        });


    } catch (error) {
        alert("Erro: " + err.message);
    }
}

async function criarPedido() {
    try {
        let pedidoUsuario = parseInt(document.getElementById('usuario_id').value)
        let pedidoProduto = parseInt(document.getElementById('produto_id').value)
        const response = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario_id: pedidoUsuario, produto_id: pedidoProduto })
        });

        if (!response.ok) throw new Error("Erro ao cadastrar pedido.")

        window.location.href = '/pagina_clientes';
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

CarregarUsuariosPedidos()