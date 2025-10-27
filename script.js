const selectFilmes = document.getElementById("filmes")
const divPersonagens = document.getElementById("personagens")
const BASE_URL = "https://api.disneyapi.dev/character?page=1&pageSize=9850"

// Buscar personagens da API
async function buscarPersonagens() {
  try {
    const resposta = await fetch(BASE_URL)
    const dados = await resposta.json()
    return dados.data
  } catch (erro) {
    console.error("Erro ao buscar personagens:", erro)
    return []
  }
}

// Extrair filmes únicos dos personagens
function extrairFilmes(personagens) {
  const filmes = personagens.flatMap(p => p.films || [])
  return [...new Set(filmes.filter(f => f))].sort()
}

// Preencher o <select> com os filmes
function preencherFilmes(filmes) {
  selectFilmes.innerHTML = '<option value="">Selecione um filme</option>'
  filmes.forEach(filme => {
    const option = document.createElement("option")
    option.value = filme
    option.textContent = filme
    selectFilmes.appendChild(option)
  })
}

// Mostrar personagens de um filme específico
function mostrarPersonagens(personagens, filmeSelecionado) {
  divPersonagens.innerHTML = ""

  const filtrados = personagens.filter(p => (p.films || []).includes(filmeSelecionado))

  if (filtrados.length === 0) {
    divPersonagens.innerHTML = `<p>Nenhum personagem encontrado para "${filmeSelecionado}".</p>`
    return
  }

  filtrados.forEach(p => {
    const imagem = p.imageUrl || "https://via.placeholder.com/300x300?text=Sem+imagem"
    const jogos = (p.videoGames && p.videoGames.length > 0) ? p.videoGames.join(", ") : "Nenhum"

    const card = document.createElement("div")
    card.classList.add("card")
    card.innerHTML = `
      <img src="${imagem}" alt="${p.name}">
      <h2>${p.name}</h2>
    `
    divPersonagens.appendChild(card)
  })
}

// Inicializar a aplicação
async function iniciar() {
  divPersonagens.innerHTML = '<p style="text-align:center;">Carregando personagens...</p>'
  selectFilmes.innerHTML = '<option>Carregando filmes...</option>'

  const personagens = await buscarPersonagens()

  if (personagens.length === 0) {
    selectFilmes.innerHTML = '<option value="">Erro ao carregar filmes</option>'
    divPersonagens.innerHTML = '<p>Não foi possível carregar os dados da API.</p>'
    return
  }

  const filmes = extrairFilmes(personagens)
  preencherFilmes(filmes)
  divPersonagens.innerHTML = '<p style="text-align:center;">Selecione um filme para ver os personagens.</p>'

  selectFilmes.addEventListener("change", () => {
    const filmeSelecionado = selectFilmes.value
    if (filmeSelecionado) {
      mostrarPersonagens(personagens, filmeSelecionado)
    } else {
      divPersonagens.innerHTML = '<p style="text-align:center;">Selecione um filme para ver os personagens.</p>'
    }
  })
}

iniciar()
