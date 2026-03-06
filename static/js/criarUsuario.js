
console.log("Arquivo criarUsuario.js carregado");


async function criarUsuario() {
    console.log("Função criarUsuario chamada");
    try {
        let novoNome = document.getElementById('usuario-nome').value;
        let novoEmail = document.getElementById('usuario-email').value;
        let novoSenha = document.getElementById('usuario-senha').value;

        console.log("Dados do usuário:", { nome: novoNome, email: novoEmail, senha: novoSenha });

        const response = await fetch(`/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                nome: novoNome, 
                email: novoEmail,
                senha: novoSenha

            })
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário.");
        }
        alert("Usuário cadastrado com sucesso!");
        console.log("vai redirecionar agora para index.html");
        window.location.replace('/'); 
        
    } catch (error) {
        console.error(error);
        alert("Erro ao criar usuário ");
    }
}
