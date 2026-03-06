
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from models import Base, Cliente, Consulta, Medico, Usuario

app = Flask(__name__)
app.secret_key = "supersecretkey"
CORS(app)

engine = create_engine("sqlite:///database.db")
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        senha = data.get('senha')

        s = Session()
        usuario = s.query(Usuario).filter_by(email=email, senha=senha).first()

        if usuario:
            session["usuario"] = usuario.nome
            return redirect(url_for("home"))
        else:
            return render_template('login.html', error="Email ou senha incorretos")

    return render_template('login.html')

@app.route('/')
def home():
    if "usuario" not in session:
        return redirect(url_for("login"))
    
    s = Session()
    usuarios = s.query(Usuario).all()
    s.close()

    return render_template("index.html", usuarios=usuarios)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/verificar-login")
def verificar_login():
    if "usuario" in session:
        return jsonify({"logado": True})
    return jsonify({"logado": False})



#Rotas de Usuários

@app.route("/criar-usuario")
def criar_usuario():
    return render_template("criarUsuario.html")

@app.route("/usuarios", methods=["GET"])
def get_usuarios():
    s = Session()
    usuarios = s.query(Usuario).all()

    resultado =[
        {"id": u.id, "nome": u.nome, "email": u.email} for u in usuarios
    ]
    s.close()
    return jsonify(resultado)

@app.route("/usuarios/<int:id>", methods=["GET"])
def get_unique_usuario(id):
    s = Session()
    usuario = s.query(Usuario).get(id)

    if not usuario:
        return jsonify({"message": "Usuário não encontrado"})

    resultado ={
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email
    }

    s.close()
    return jsonify(resultado)

@app.route("/usuarios", methods=["POST"])
def add_usuario():
    s = Session()
    data = request.json

    if not data:
        s.close()
        return jsonify({"erro": "Nenhum dado recebido"}), 400
    
    u = Usuario(nome=data["nome"], email=data["email"], senha=data["senha"])
    s.add(u)
    s.commit()
    s.close()
    
    return jsonify({"message": "Usuário criado!"})


@app.route("/usuarios/<int:id>", methods=["PUT"])
def update_usuario(id):
    s = Session()
    u = s.query(Usuario).get(id)
    if not u:
        s.close()
        return jsonify({"message": "Usuário não encontrado"})
    
    data = request.json
    u.nome = data["nome"]
    u.email = data["email"]
    u.senha = data["senha"]
    s.commit()
    s.close()
    return jsonify({"message": "Usuário atualizado!"})


@app.route("/usuarios/<int:id>", methods=["DELETE"])
def delete_usuario(id):
    s = Session()
    u = s.query(Usuario).get(id)
    if not u:
        s.close()
        return jsonify({"message": "Usuário não encontrado"})
    s.delete(u)
    s.commit()
    s.close()
    return jsonify({"message": "Usuário deletado!"})

#Rotas de Clintes
@app.route("/clientes")
def pagina_clientes():
    s = Session()
    clientes = s.query(Cliente).all()
    s.close()
    return render_template("clientes.html", clientes=clientes)

@app.route("/clientes/novo", methods=["GET", "POST"])
def criar_cliente():
    s = Session()
    if request.method == "POST":
        novo = Cliente(
            nome=request.form["nome"],
            cpf=request.form["cpf"],
            telefone=request.form["telefone"]
        )
        s.add(novo)
        s.commit()
        s.close()
        return redirect(url_for("pagina_clientes"))

    s.close()
    return render_template("criarCliente.html")

@app.route("/api/clientes", methods=["POST"])
def add_cliente():
    s = Session()
    data = request.get_json()
    if not data:
        s.close()
        return jsonify({"erro": "Nenhum dado recebido"})
    
    novo_cliente = Cliente(
        nome=data["nome"], 
        cpf=data["cpf"], 
        telefone=data["telefone"]
        )
    s.add(novo_cliente)
    s.commit()
    s.close()
    return jsonify({"message": "Cliente criado!"})

@app.route("/api/clientes", methods=["GET"])
def listar_cliente():
    s = Session()
    c = s.query(Cliente).all()
    s.close()
    if not c:
        return jsonify({"erro": "Cliente não encontrado"})
    
    return jsonify([
        {
            "id": cliente.id, 
            "nome": cliente.nome, 
            "cpf": cliente.cpf, 
            "telefone": cliente.telefone
        }for cliente in c
    ])

@app.route("/api/clientes/<int:id>", methods=["PUT"])
def update_cliente(id):
    s = Session()
    cliente = s.query(Cliente).filter(Cliente.id == id).first()
    if not cliente:
        s.close()
        return jsonify({"erro": "Cliente não encontrado"}), 404

    data = request.get_json()
    if not data:
        s.close()
        return jsonify({"erro": "Nenhum dado recebido"}), 400

    cliente.nome = data.get("nome", cliente.nome)
    cliente.cpf = data.get("cpf", cliente.cpf)
    cliente.telefone = data.get("telefone", cliente.telefone)
    s.commit()
    s.close()
    return jsonify({"message": "Cliente atualizado!"})

@app.route("/api/clientes/<int:id>", methods=["DELETE"])
def delete_cliente(id):
    s = Session()
    c = s.query(Cliente).filter(Cliente.id == id).first()

    if c:
        s.delete(c)
        s.commit()
        s.close()
        return jsonify({"message": "Cliente deletado!"})
    s.close()
    return jsonify({"erro": "Cliente não encontrado"})

#Rotas de Medicos
@app.route("/medicos-page")
def medicos_page():
    return render_template("medicos.html")

@app.route("/medicos/novo")
def novo_medico():
    return render_template("criarMedico.html")

@app.route('/api/medicos', methods=["GET"])
def listar_medicos():
    s = Session()
    medicos = s.query(Medico).all()
    resultado = []
    for m in medicos:
        resultado.append({
            "id": m.id,
            "nome": m.nome,
            "especialidade": m.especialidade,
            "crm": m.crm
        })
    s.close()
    return jsonify(resultado)


@app.route("/api/medicos", methods=["POST"])
def add_medico():
    data = request.get_json()
    s = Session()
    m = Medico(
        nome=data["nome"],
        especialidade=data["especialidade"],
        crm=data["crm"]
    )
    s.add(m)
    s.commit()
    s.close()
    return jsonify({"message": "Médico criado!"})


@app.route("/api/medicos/<int:id>", methods=["PUT"])
def update_medico(id):
    s = Session()
    m = s.query(Medico).get(id)
    if not m:
        s.close()
        return jsonify({"message": "Médico não encontrado"})
    data = request.json
    m.nome = data["nome"]
    m.especialidade = data["especialidade"]
    m.crm = data["crm"]
    s.commit()
    s.close()
    return jsonify({"message": "Médico atualizado!"})

@app.route("/api/medicos/<int:id>", methods=["DELETE"])
def delete_medico(id):
    s = Session()
    m = s.query(Medico).filter(Medico.id == id).first()
    if m:
        s.delete(m)
        s.commit()
    s.close()
    return jsonify({"message": m and "Médico deletado!" or "Médico não encontrado!"})
   

#Rotas de Consulta
@app.route("/api/consultas", methods=["GET"])
def listar_consulta():
    s = Session()
    consultas = s.query(Consulta).all()
    for con in consultas:
        if con.data_hora < datetime.now() and con.status == "agendado":
            con.status = "concluído"
    res = [
        {
            "id": con.id,
            "data_hora": con.data_hora,
            "status": con.status,
            "usuario": con.usuario.nome,
            "cliente": con.cliente.nome,
            "medico": con.medico.nome
        }
        for con in consultas
    ]
    s.close()
    return jsonify(res)


@app.route("/api/consultas", methods=["POST"])
def add_consulta():
    s = Session()
    data = request.get_json()
    data_hora=datetime.strptime(data["data_hora"], "%Y-%m-%d %H:%M")
    consulta = Consulta(
        data_hora=data_hora,
        status="agendado",
        medico_id=data["medico_id"],
        cliente_id=data["cliente_id"],
        usuario_id=1
    )

    s.add(consulta)
    s.commit()
    s.close()
    return jsonify({"message": "Consulta criada!"})

@app.route("/api/consultas/<int:id>", methods=["PUT"])
def update_consulta(id):
    s = Session()
    con = s.query(Consulta).get(id)
    if not con:
        s.close()
        return jsonify({"message": "Consulta não encontrada"})
    
    data = request.json
    con.data_hora = datetime.strptime(data["data_hora"], "%Y-%m-%d %H:%M")
    con.usuario_id = data["usuario_id"]
    con.cliente_id = data["cliente_id"]
    con.medico_id = data["medico_id"]

    s.commit()
    s.close()
    return jsonify({"message": "Consulta atualizada!"})

@app.route('/api/consultas/<int:id>/status', methods=['PUT'])
def atualizar_status(id):
    consulta = Session.get(Consulta, id)
    if not consulta:
        return jsonify({"erro": "Consulta não encontrada"})

    data = request.json
    novo_status = data.get("status")
    if novo_status not in ["agendado", "concluido", "pendente", "cancelado"]:
        return jsonify({"erro": "Status inválido"})

    consulta.status = novo_status
    Session.commit()
    return jsonify({"msg": "Status atualizado"})

@app.route("/api/consultas/<int:id>", methods=["DELETE"])
def delete_consulta(id):
    s = Session()
    con = s.query(Consulta).get(Consulta,id)
    if not con:
        return jsonify({"message": "Consulta não encontrada"})
    con.status = "cancelado"
    s.commit()
    s.close()
    return jsonify({"message": "Consulta cancelada!"})


#rotas agendamento
@app.route('/agendamentos')
def listar_agendamentos():
    s = Session()
    consultas = s.query(Consulta).all()

    for c in consultas:
        if c.data_hora < datetime.now() and c.status == "agendado":
            c.status = "concluído"
    
    s.commit()
    
    return render_template("agendamentos.html", consultas=consultas)

@app.route("/agendar")
def tela_agendamento():
    s = Session()
    med = s.query(Medico).all()
    c = s.query(Cliente).all()
    s.close()
    return render_template("criarAgendamento.html", medicos=med, clientes=c)

@app.route('/criar-agendamento', methods=['POST'])
def criar_agendamento():
    data = request.form.get('data')
    hora = request.form.get('horario')
    medico_id = request.form.get('medico_id')
    cliente_id = request.form.get('cliente_id')

    data_hora = datetime.strptime(f"{data} {hora}", "%Y-%m-%d %H:%M")

    if data_hora < datetime.now():
        status ="Concluído"
    else:
        status = "Agendado"

    s = Session()
    consulta = Consulta(
        data_hora=data_hora,
        status=status,
        medico_id=medico_id,
        cliente_id=cliente_id,
        usuario_id=1  
    )
    s.add(consulta)
    s.commit()
    s.close()
    return redirect('/agendamentos')

@app.route('/api/editar-agendamento/<int:id>', methods=['GET', 'POST'])
def editar_agendamento(id):
    session = Session()
    con = session.query(Consulta).get(id)

    if not con:
        session.close()
        return jsonify({"message": "Consulta não encontrada"})

    if request.method == 'POST':
        data = request.form.get('data')
        hora = request.form.get('hora')
        status = request.form.get('status')

        con.data_hora = datetime.strptime(f"{data} {hora}", "%Y-%m-%d %H:%M")
        con.status = status

        session.commit()
        session.close()

        return redirect('/agendamentos')

    session.close()
    return render_template("editarAgendamento.html", consulta=con)


if __name__ == "__main__":
    
    app.run(debug=True)