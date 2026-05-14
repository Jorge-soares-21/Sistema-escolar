let token = "";
let alunoId = null;

async function login() {
    const matricula = document.getElementById("matricula").value;
    const senha = document.getElementById("senha").value; 
    const btn = document.getElementById("btnLogin");
    const loading = document.getElementById("loadingLogin");

    // Ativa LOADING
    btn.disabled = true;
    btn.innerText = "Entrando...";
    loading.style.display = "inline";

    try {
      const resposta = await fetch("http://localhost:3000/alunos/login", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ matricula, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      token = dados.token;
      alunoId = dados.usuario.id;

      document.getElementById("nomeAluno").innerText = dados.usuario.nome;
      document.getElementById("matricula").innerText = "Matrícula" + dados.usuario.matricula;

      document.getElementById("loginAluno").style.display = "none";
      document.getElementById("dashboard").style.display = "block";

      buscarNotas();
      buscarRecados();


    } else {
      alert(dados.message);
  }

    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      // Desativa LOADING
      btn.disabled = false;
      btn.innerText = "Entrar";
      loading.style.display = "none";
    }

}

async function buscarNotas() {
  const resposta = await fetch(`http://localhost:3000/notas/aluno/${alunoId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const notas = await resposta.json();

  const tabela = document.getElementById("tabelaNotas");
  tabela.innerHTML = "";

  notas.forEach(nota => {
    const linha = `
        <tr>
            <td>${nota.disciplina}</td>
            <td>${nota.valor_nota}</td>
            <td>${nota.valor_trabalho}</td>
            <td>${Number(nota.media).toFixed(2)}</td>
            <td>${nota.situacao}</td>
        </tr>`;
        tabela.innerHTML += linha;
  });
}

function logout() {
    token = "";
    alunoId = null;

    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginAluno").style.display = "flex";
  }

  // Função para buscar recados do aluno
  async function buscarRecados() {
      console.log("Buscando recados...");
      const resposta = await fetch("http://localhost:3000/recados", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const recados = await resposta.json();
      console.log(recados);

      const listaRecados = document.getElementById("listarRecados");
      listaRecados.innerHTML = "";

      recados.forEach(recado => {
          const card = document.createElement("div");
          card.classList.add("card-recado");

          card.innerHTML = `
          <h4>${recado.titulo}</h4>
          <p>${recado.mensagem}</p>
          
          ${recado.lido ? "<span>✅ Lido</span>": `<button onclick="marcarComoLido(${recado.id})">Marcar como lido</button>`}`;

          
          listaRecados.appendChild(card);
      });

  };

  // Função para marcar recado como lido.
  async function marcarComoLido(id) {
    await fetch(`http://localhost:3000/recados/${id}/lido`, {
      method: "post", 
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    buscarRecados();// Atrualiza a lista de recados.
  };

  // função para mostras a seção.
  function mostrarSecao(id) {
  document.querySelectorAll(".secao").forEach(secao => {
    secao.classList.remove("ativa");
  });

  document.getElementById(id).classList.add("ativa");
};