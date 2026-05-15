let tokenProfessor = "";

let todasMatriculas = []; // Variável global para armazenar todas as matrículas.

let todasNotas = []; // Variável global para armazenar todas as notas.

const API_URL =  "https://sistema-escolar-bjw0.onrender.com";


async function loginProfessor() {
    const login = document.getElementById("loginProf").value;
    const senha = document.getElementById("senhaProf").value; 
    const btn = document.getElementById("btnLogin");
    const loading = document.getElementById("loadingLogin");

    // Ativa LOADING
    btn.disabled = true;
    btn.innerText = "Entrando...";
    loading.style.display = "inline";

    try {
        const resposta = await fetch(`${API_URL}/professores/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ login, senha })
    });

        const dados = await resposta.json();

        if (resposta.ok) {
            tokenProfessor = dados.token;

            document.getElementById("nomeProfessor").innerText = dados.usuario.nome;

            document.getElementById("loginProfessor").style.display = "none";
            document.getElementById("dashboardProfessor").style.display = "block";

            carregarMatriculas();
        } else {
        alert(dados.message);
        }
    } catch (error) {
        alert("Erro ao conectar o servidor")
    } finally {
        // Desativa LOADING
        btn.disabled = false;
        btn.innerText = "Entrar";
        loading.style.display = "none";
    }
};

async function carregarMatriculas() {
    const resposta = await fetch(`${API_URL}/matriculas/professor`, {
        headers: {
            Authorization: `Bearer ${tokenProfessor}`
        }
    });


    const matriculas = await resposta.json();

    todasMatriculas = matriculas; // Armazena as matrículas na variável global.

    preencherFiltro(matriculas);
    renderizarTabela(matriculas);

    preencherFiltroNotas(matriculas);
    
};

// Função para preencher o select.
function preencherFiltro(matriculas) {
    const select = document.getElementById("filtroDisciplina");
    const disciplinasUnicas = [...new Set(matriculas.map(m => m.disciplina))]; // Extrai disciplinas únicas.

    disciplinasUnicas.forEach(d => {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        select.appendChild(option);
    });
};

// Função de filtro.
function filtraPorDisciplina() {
    const disciplina = document.getElementById("filtroDisciplina").value;

    if (!disciplina) {
        renderizarTabela(todasMatriculas); // Renderiza todas as matrículas se nenhuma disciplina for selecionada.
        return;
    }

    const matriculasFiltradas = todasMatriculas.filter(m => m.disciplina === disciplina);

    renderizarTabela(matriculasFiltradas);
};

// Função para renderizar a tabela.
function renderizarTabela(lista) {
  const tabela = document.getElementById("tabelaProfessor");
  tabela.innerHTML = "";

  lista.forEach(m => {
    const linha = `
      <tr>
        <td>${m.aluno}</td>
        <td>${m.disciplina}</td>
        <td><input type="number" id="nota_${m.id}"></td>
        <td><input type="number" id="trab_${m.id}"></td>
        <td><button onclick="lancarNota(${m.id})">Salvar</button></td>
      </tr>
    `;
    tabela.innerHTML += linha;
  });
};

async function lancarNota(id_matricula) {
    const valor_nota = document.getElementById(`nota_${id_matricula}`).value;
    const valor_trabalho = document.getElementById(`trab_${id_matricula}`).value;

    const resposta = await fetch(`${API_URL}/notas`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenProfessor}`
        },
        body: JSON.stringify({ id_matricula, valor_nota, valor_trabalho})
    });

    if (resposta.ok) {
        alert("Nota lançada com sucesso!");
    } else {
        alert("Erro ao lançar nota");
    }
};

function logoutProfessor () {
    tokenProfessor = "";

    document.getElementById("dashboardProfessor").style.display = "none";
    document.getElementById("loginProfessor").style.display = "flex";
};

// função para mostras a seção.
  function mostrarSecao(id) {
  document.querySelectorAll(".secao").forEach(secao => {
    secao.classList.remove("ativa");
  });

  document.getElementById(id).classList.add("ativa");
};

// Função para carregar as notas na seção de visualização.

async function carregarNotas() {
    const resposta = await fetch(`${API_URL}/notas/professor`, {
        headers: {
            Authorization: `Bearer ${tokenProfessor}`
        }
    });

    todasNotas = await resposta.json();
    
    const tabela = document.getElementById("tabelaNotasProfessor");
    tabela.innerHTML = "";

    todasNotas.forEach(nota => {
    const linha = document.createElement("tr");

    renderizarTabelaNotas(todasNotas);

    preencherFiltroNotas(todasNotas);

    linha.innerHTML =
     `
      <td>${nota.aluno}</td>
      <td>${nota.disciplina}</td>

      <td>
        <input type="number" value="${nota.valor_nota}" id="nota${nota.id}" disabled>
      </td>

      <td>
        <input type="number" value="${nota.valor_trabalho}" id="trab${nota.id}" disabled>
      </td>

      <td>
        <button onclick="editarNota(${nota.id})">✏️ Editar</button>
        <button onclick="salvarNota(${nota.id})" style="display:none;" id="btnSalvar_${nota.id}">💾 Salvar</button>
      </td>`;

        tabela.appendChild(linha);

    });

};


// Função para liberar os campos para edição.
function editarNota(id) {
  const inputNota = document.getElementById(`nota${id}`);
  const inputTrab = document.getElementById(`trab${id}`);
  const btnSalvar = document.getElementById(`btnSalvar_${id}`);

  inputNota.disabled = false;
  inputTrab.disabled = false;

  // destaque visual
  inputNota.style.border = "2px solid #22c55e";
  inputTrab.style.border = "2px solid #22c55e";
  inputNota.style.backgroundColor = "#fff";
  inputTrab.style.backgroundColor = "#fff";

  btnSalvar.style.display = "inline";

  console.log(inputNota);

};

// Função para salvar a nota editada.
async function salvarNota(id) {
    const valor_nota = document.getElementById(`nota${id}`).value;
    const valor_trabalho = document.getElementById(`trab${id}`).value;

    const resposta = await fetch(`${API_URL}/notas/${id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokenProfessor}`
        },
        body: JSON.stringify({ valor_nota, valor_trabalho })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
        alert("Nota atualizada com sucesso!");
        carregarNotas(); // Recarrega as notas para refletir as mudanças.
    } else {
        alert(dados.message || "Erro ao atualizar nota");
    }
};

// filtro para mostrar apenas as notas de uma disciplina específica.
function preencherFiltroNotas(notas) {
    const select = document.getElementById("filtroDisciplinaNotas");
    const disciplinasUnicas = [...new Set(notas.map(n => n.disciplina))]; // Extrai disciplinas únicas.

    select.innerHTML = '<option value="">Todas</option>';


    disciplinasUnicas.forEach(d => {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        select.appendChild(option);
    });
};

// Função de filtro para a tabela de notas.
function filtraNotasPorDisciplina() {
    const disciplina = document.getElementById("filtroDisciplinaNotas").value;

    if (!disciplina) {
        renderizarTabelaNotas(todasNotas); // Renderiza todas as notas se nenhuma disciplina for selecionada.
        return;
    }

    const notasFiltradas = todasNotas.filter(n => n.disciplina === disciplina);

    console.log(notasFiltradas);

    renderizarTabelaNotas(notasFiltradas);
};

// Função para renderizar a tabela de notas.
function renderizarTabelaNotas(lista) {
  const tabela = document.getElementById("tabelaNotasProfessor");
  tabela.innerHTML = "";

  lista.forEach(nota => {
    const linha = `
      <tr>
        <td>${nota.aluno}</td>
        <td>${nota.disciplina}</td>
        <td><input type="number" value="${nota.valor_nota ?? ""}" id="nota${nota.id}" disabled></td>
        <td><input type="number" value="${nota.valor_trabalho ?? ""}" id="trab${nota.id}" disabled></td>
        <td><button onclick="editarNota(${nota.id})">✏️ Editar</button>
        <button onclick="salvarNota(${nota.id})" style="display:none;" id="btnSalvar_${nota.id}">💾 Salvar</button>></td>
      </tr>
    `;
    tabela.innerHTML += linha;

  });

};
