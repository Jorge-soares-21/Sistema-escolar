let tokenAdmin = "";
let alunoSelecionado = null;

async function loginAdmin() {
    const login = document.getElementById("loginAdminInput").value;
    const senha = document.getElementById("senhaAdminInput").value;

    const resposta = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ login, senha })
    });
    
    const dados = await resposta.json();

    if (resposta.ok) {
        tokenAdmin = dados.token;

        buscarRecadosAdmin();

        document.getElementById("loginAdmin").style.display = "none";
        document.getElementById("dashboardAdmin").style.display = "block";
    } else {
        alert("Erro no login");
    }
}

// função para criar alunos
async function criarAluno() {
    const nome = document.getElementById("nomeAlunoInput").value;
    const cpf = document.getElementById("cpfAlunoInput").value;
    const endereco = document.getElementById("enderecoAlunoInput").value;
    const data_nascimento = document.getElementById("data_nascimentoAlunoInput").value;
    const telefone = document.getElementById("telefoneAlunoInput").value;

    // Vlidação entes da requisição.
    if (cpf.length !== 11) {
        mostrarMensagem("CPF deve conter 11 dígitos", "erro");
        return;
    }

    const resposta =await fetch("http://localhost:3000/alunos", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({ nome, endereco, data_nascimento, telefone, cpf })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
        mostrarMensagem("Aluno criado com sucesso!", "sucesso");
    } else {
        mostrarMensagem(dados.message, "erro");
    }
}

// função para criar professores
async function criarProfessor() {
    const nome = document.getElementById("nomeProfessorInput").value;
    const cpf = document.getElementById("cpfProfessorInput").value;
    const endereco = document.getElementById("enderecoProfessorInput").value;
    const data_nascimento = document.getElementById("data_nascimentoProfessorInput").value;
    const telefone = document.getElementById("telefoneProfessorInput").value;
    const login = document.getElementById("loginProfessorInput").value;
    const senha = document.getElementById("senhaProfessorInput").value;

    if (cpf.length !== 11) {
        mostrarMensagem("CPF deve conter 11 dígitos", "erro");
        return;
    }

    const resposta = await fetch("http://localhost:3000/professores", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({ nome, endereco, data_nascimento, telefone, login, senha, cpf })
    });

    const dados = await resposta.json();
    if (resposta.ok) {
        mostrarMensagem("Professor criado!", "sucesso");
    } else {
        mostrarMensagem(dados.message, "erro");
    }
};

// função para criar recados.
async function criarRecado() {
    const titulo = document.getElementById("assuntoRecadoInput").value;
    const mensagem = document.getElementById("mensagemRecadoInput").value;

    await fetch("http://localhost:3000/recados", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({ titulo, mensagem })
    });

    mostrarMensagem("Recado criado!", "sucesso");
}; 

// função para listar recados.
async function buscarRecadosAdmin() {
  const resposta = await fetch("http://localhost:3000/recados", {
    headers: {
      Authorization: `Bearer ${tokenAdmin}`
    }
  });

  const recados = await resposta.json();

  if (!resposta.ok) {
    console.error(recados);
    alert("Erro ao buscar recados");
    return;
  }

  const lista = document.getElementById("listaRecadosAdmin");
  lista.innerHTML = "";

  recados.forEach(recado => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${recado.titulo}</strong><br>
      ${recado.mensagem}<br>
      <button onclick="deletarRecado(${recado.id})">🗑 Excluir</button>
      <hr>
    `;

    lista.appendChild(div);
  });
};

// Função para deletar recado.
async function deletarRecado(id) {
    await fetch(`http://localhost:3000/recados/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${tokenAdmin}`
        }
    });

    buscarRecadosAdmin();
};

// Função para mostrar seção.
function mostrarSecao(id) {
  document.querySelectorAll(".secao").forEach(secao => {
    secao.classList.remove("ativa");
  });

  document.getElementById(id).classList.add("ativa");
}; 

// Controle de exibição do aluno.
function mostrarCardastroAluno() {
  document.getElementById("formAluno").style.display = "block";
};

function fecharCadastroAluno() {
  document.getElementById("formAluno").style.display = "none";
};

// Função para listar os alunos.
async function buscarAlunos() {
    const resposta = await fetch("http://localhost:3000/matriculas", {
        headers: {
                Authorization: `Bearer ${tokenAdmin}`
        }
    });

    const alunos = await resposta.json();

    const tabela = document.getElementById("tabelaAlunos");
    tabela.innerHTML = "";

     alunos.forEach(aluno => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${aluno.nome}</td>
      <td>
        ${aluno.matriculado 
          ? "<span style='color:green;'>Matriculado</span>" 
          : "<span style='color:red;'>Não matriculado</span>"}
      </td>
        <button onclick="abrirMatricula(${aluno.id})">
      📚 Matricular
        </button>
        <button onclick="deletarAluno(${aluno.id})">🗑</button>
      </td>
    `;

    tabela.appendChild(linha);
  });
}

// Função para matrícular aluno.
async function criarMatricula() {
    const id_aluno = document.getElementById("alunoIdInput").value;
    const id_disciplina = document.getElementById("disciplinaInput").value;

    const resposta = await fetch("http://localhost:3000/matriculas", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({ id_aluno, id_disciplina })
    });

    if (resposta.ok) {
        alert("Aluno matrículado com sucesso!");
    } else {
        alert("Erro ao matrícular")
    }
};

// Abrir modal quando clicar em "Matricular".

function abrirMatricula(id) {
    alunoSelecionado = id;

    document.getElementById("modalMatricula").style.display = "flex";

    carregarDisciplinas();
};

// Buscar disciplinas (preencher o select).
async function carregarDisciplinas() {
    const resposta = await fetch("http://localhost:3000/disciplinas", {
        headers: {
            Authorization: `Bearer ${tokenAdmin}`
        }
    });

    const disciplinas = await resposta.json();

    const select = document.getElementById("selectDisciplina");
    select.innerHTML = "";

    disciplinas.forEach(d => {
        const option = document.createElement("option");
        option.value = d.id;
        option.textContent = d.nome;

        select.appendChild(option);
    });
};

// Function para confimar matricula.
async function confirmarMatricula() {
    const disciplinaId = document.getElementById("selectDisciplina").value;

    const resposta = await fetch("http://localhost:3000/matriculas", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({
            id_aluno: alunoSelecionado,
            id_disciplina: disciplinaId
        })
    });

    const dados = await resposta.json();
    console.log(dados);
    
    if(resposta.ok) {
        mostrarMensagem("Aluno matriculado com sucesso!", "sucesso");

        fecharModal();
        buscarAlunos(); // Atualiza lista

    } else {
        mostrarMensagem(dados.message, "erro");
    }
};

// Função para fechar o modal.
function fecharModal() {
  document.getElementById("modalMatricula").style.display = "none";
};

// Função para mostrar messagem ao matricular aluno.
function mostrarMensagem(texto, tipo = "sucesso") {
  const msg = document.createElement("div");

  msg.classList.add("mensagem", tipo);
  msg.innerText = texto;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 3000);
};

// Função para deletar aluno.
async function deletarAluno(id) {
    const confimar = confirm("Tem certeza que deseja excluir este aluno?");

    if (!confimar) return;

    const resposta = await fetch(`http://localhost:3000/alunos/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${tokenAdmin}`
        }
    });

    const dados = await resposta.json();

    if (resposta.ok) {
        mostrarMensagem("Aluno excluído com sucesso!", "sucesso");
        buscarAlunos(); // Atualiza lista.
    } else {
        mostrarMensagem(dados.message || "Erro ao excluir aluno", "erro");
    }
};

// Controle de exibição do professor.
function mostrarCardastroProfessor() {
  document.getElementById("formProfessor").style.display = "block";
};

function fecharCadastroProfessor() {
  document.getElementById("formProfessor").style.display = "none";
};

// Função para listar os professores.
async function buscarProfessores() {
    const resposta = await fetch("http://localhost:3000/professores", {
        headers: {
                Authorization: `Bearer ${tokenAdmin}`
        }
    });

    const professores = await resposta.json();

    const tabela = document.getElementById("tabelaProfessores");
    tabela.innerHTML = "";

     professores.forEach(professor => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${professor.nome}</td>
      <td>
        ${professor.ativo, "<span style='color:green;'>Ativo</span>"}
      </td>
        <button onclick="deletarProfessor(${professor.id})">🗑</button>
      </td>
    `;

    tabela.appendChild(linha);
  });
};

// Função para deletar professor.
async function deletarProfessor(id) {
    const confimar = confirm("Tem certeza que deseja excluir este professor?");

    if (!confimar) return;

    const resposta = await fetch(`http://localhost:3000/professores/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${tokenAdmin}`
        }
    });

    const dados = await resposta.json();

    if (resposta.ok) {
        mostrarMensagem("Professor excluído com sucesso!", "sucesso");
        buscarProfessores(); // Atualiza lista.
    } else {
        mostrarMensagem(dados.message || "Erro ao excluir professor", "erro");
    }
};

// Controle de exibição do disciplina.
function mostrarCardastroDisciplina() {
  document.getElementById("formDisciplina").style.display = "block";
};

function fecharCadastroDisciplina() {
  document.getElementById("formDisciplina").style.display = "none";
};

// Função para listar Disciplinas.
async function buscarDisciplinas() {
    const resposta = await fetch("http://localhost:3000/disciplinas", {
        headers: {
            Authorization: `Beaer ${tokenAdmin}`
        }
    });

    const disciplinas = await resposta.json();

    const tabela = document.getElementById("tabelaDisciplina");
    tabela.innerHTML = "";

    disciplinas.forEach(disciplina => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${disciplina.nome}</td>
      <td>
        ${disciplina.carga_horaria}
    `;

    tabela.appendChild(linha);
  });
    
    
};

// Função para criar Disciplina.
async function cadastrarDisciplina() {
    const nome = document.getElementById("inputDisciplina").value;
    const carga_horaria = document.getElementById("cargaHorariaInput").value;

    await fetch("http://localhost:3000/disciplinas", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify({nome, carga_horaria})
    });

    mostrarMensagem("Disciplina criada com sucesso!");
}