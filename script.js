/**
 * Qual é a Palavra? - Jogo de Duplas
 * Script principal do jogo
 */

(function() {
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     VARIÁVEIS GLOBAIS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  let primeiraTentativa = true;
  let timerJaIniciado = false;
  let jogadores = [];
  let duplas = [];
  let scores = [];
  let palavrasRodada = [];
  let indicePalavra = 0;
  let duplaAtual = 0;
  let tempoMaximoValue = 60;
  let tempoRestante = 60;
  let timerInterval = null;
  let historico = [];
  let cameraStream = null;
  let tempFotoDataUrl = "";
  let modoDuplas = "aleatorio";
  // Novo: para controlar alternância de papéis dentro da dupla
  let inverterPapeis = false;

  // Quantidade mínima de palavras por rodada (aumentado para 50)
  const MIN_PALAVRAS_RODADA = 50;

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     LISTAS DE PALAVRAS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // Lista principal de palavras em português do Brasil
  const bigPTBR = [
    // Substantivos comuns
    "Amor", "Gato", "Casa", "Pão", "Anel", "Mesa", "Bolo", "Faro", "Onça", "Alvo", "Vela", "Abacate",
    "Bola", "Café", "Dedo", "Escola", "Festa", "Gaveta", "Homem", "Ilha", "Janela", "Kiwi", "Limão",
    "Mala", "Navio", "Olho", "Porta", "Queijo", "Rato", "Sapo", "Tela", "Uva", "Vento", "Xícara",
    "Zebra", "Água", "Banho", "Carro", "Dança", "Estrela", "Fogo", "Gelo", "História", "Igreja",
    "Jardim", "Leite", "Mar", "Noite", "Ovo", "Peixe", "Quadro", "Rio", "Sol", "Terra", "Universo",
    
    // Adjetivos
    "Alegre", "Bonito", "Calmo", "Doce", "Estranho", "Feliz", "Grande", "Humilde", "Inteligente",
    "Jovem", "Lindo", "Macio", "Novo", "Organizado", "Pequeno", "Quente", "Rico", "Suave", "Triste",
    
    // Profissões
    "Médico", "Professor", "Bombeiro", "Piloto", "Dentista", "Padeiro", "Advogado", "Motorista",
    
    // Lugares
    "Praia", "Montanha", "Cidade", "Floresta", "Deserto", "Parque", "Museu", "Cinema", "Teatro",
    
    // Animais
    "Macaco", "Leão", "Tigre", "Girafa", "Elefante", "Papagaio", "Cachorro", "Cobra", "Lobo",
    "Coelho", "Panda", "Urso", "Águia", "Tubarão", "Baleia", "Golfinho", "Formiga", "Abelha",
    
    // Alimentos
    "Pizza", "Hambúrguer", "Sorvete", "Chocolate", "Banana", "Laranja", "Maçã", "Abacaxi", "Morango",
    "Manga", "Batata", "Cenoura", "Arroz", "Feijão", "Macarrão", "Salada", "Carne", "Frango", "Peixe",
    
    // Esportes
    "Futebol", "Vôlei", "Basquete", "Natação", "Tênis", "Ciclismo", "Boxe", "Judô", "Surf", "Corrida",
    
    // Tecnologia
    "Celular", "Computador", "Internet", "Tablet", "Camera", "Teclado", "Mouse", "Monitor", "Impressora",
    
    // Itens de casa
    "Sofá", "Cama", "Televisão", "Geladeira", "Fogão", "Cadeira", "Tapete", "Espelho", "Abajur", "Relógio",
    
    // Meios de transporte
    "Avião", "Trem", "Ônibus", "Barco", "Bicicleta", "Caminhão", "Helicóptero", "Submarino", "Foguete",
    
    // Natureza
    "Árvore", "Flor", "Nuvem", "Chuva", "Neve", "Vento", "Vulcão", "Cachoeira", "Montanha", "Oceano",
    
    // Verbos
    "Correr", "Cantar", "Dançar", "Nadar", "Comer", "Beber", "Dormir", "Sonhar", "Trabalhar", "Estudar",
    
    // Roupas
    "Camisa", "Calça", "Vestido", "Sapato", "Boné", "Chapéu", "Meia", "Casaco", "Luva", "Cachecol",
    
    // Cores
    "Vermelho", "Azul", "Verde", "Amarelo", "Roxo", "Rosa", "Laranja", "Marrom", "Preto", "Branco",
    
    // Instrumentos musicais
    "Violão", "Piano", "Bateria", "Flauta", "Saxofone", "Violino", "Guitarra", "Teclado", "Trompete",
    
    // Partes do corpo
    "Cabeça", "Braço", "Perna", "Pé", "Mão", "Coração", "Joelho", "Cotovelo", "Ombro", "Orelha",
    
    // Sentimentos
    "Alegria", "Tristeza", "Raiva", "Medo", "Amor", "Saudade", "Esperança", "Ansiedade", "Paz", "Felicidade"
  ];

  // Outras línguas
  const palavrasBanco = {
    "PT-PT": [
      "cão", "arco-íris", "vermelho", "futebol", "jantar", "comboio", "autocarro", "telemóvel", 
      "pequeno-almoço", "escola", "universidade", "praia", "montanha", "floresta", "campo", 
      "cidade", "aldeia", "vila", "rua", "estrada", "carro", "bicicleta", "mota", "casa", 
      "apartamento", "jardim", "quarto", "cozinha", "sala", "casa-de-banho", "sofá", "cadeira", 
      "mesa", "cama", "frigorífico", "televisão", "computador", "livro", "caneta", "lápis", 
      "mochila", "sapato", "camisa", "calças", "chapéu", "relógio", "óculos", "água", "sumo", 
      "café", "chá", "pão", "queijo", "arroz", "bacalhau", "pastel", "bolo"
    ],
    "EN-US": [
      "dog", "rainbow", "red", "soccer", "dinner", "family", "house", "car", "school", "beach",
      "ocean", "mountain", "forest", "city", "village", "street", "road", "bicycle", "garden",
      "bedroom", "kitchen", "bathroom", "sofa", "chair", "table", "bed", "refrigerator", "television",
      "computer", "book", "pen", "pencil", "backpack", "shoe", "shirt", "pants", "hat", "watch",
      "glasses", "water", "juice", "coffee", "tea", "bread", "cheese", "rice", "pasta", "cake",
      "friend", "love", "happiness", "sadness", "anger", "hope", "dream", "music", "movie", "game"
    ],
    "ES": [
      "perro", "arcoiris", "rojo", "futbol", "cena", "familia", "casa", "coche", "escuela", "playa",
      "océano", "montaña", "bosque", "ciudad", "pueblo", "calle", "carretera", "bicicleta", "jardín",
      "dormitorio", "cocina", "baño", "sofá", "silla", "mesa", "cama", "refrigerador", "televisión",
      "ordenador", "libro", "bolígrafo", "lápiz", "mochila", "zapato", "camisa", "pantalones", "sombrero",
      "reloj", "gafas", "agua", "jugo", "café", "té", "pan", "queso", "arroz", "pasta", "pastel",
      "amigo", "amor", "felicidad", "tristeza", "enfado", "esperanza", "sueño", "música", "película", "juego"
    ]
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CAPTURAS DO DOM
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  const modalRegras = document.getElementById("modalRegras");
  const btnRegras = document.getElementById("btnRegras");
  const btnFecharModal = document.getElementById("btnFecharModal");
  const btnFalarRegras = document.getElementById("btnFalarRegras");

  const configScreen = document.getElementById("config-screen");
  const mainScreen = document.getElementById("main-screen");
  const endScreen = document.getElementById("end-screen");

  const inputTempoMaximo = document.getElementById("tempoMaximo");
  const inputNomeJogador = document.getElementById("nomeJogador");
  const inputFotoJogador = document.getElementById("fotoJogador");
  const listaJogadoresEl = document.getElementById("listaJogadores");

  const btnAbrirCamera = document.getElementById("btnAbrirCamera");
  const btnCapturarFoto = document.getElementById("btnCapturarFoto");
  const videoCamera = document.getElementById("videoCamera");
  const canvasFoto = document.getElementById("canvasFoto");

  const btnAdicionarJogador = document.getElementById("btnAdicionarJogador");
  const btnIniciar = document.getElementById("btnIniciar");
  const btnEncerrar = document.getElementById("btnEncerrar");
  const btnTrocar = document.getElementById("btnTrocar");
  const btnPular = document.getElementById("btnPular");

  const btnToggleTempo = document.getElementById("btnToggleTempo");
  const btnResetTempo = document.getElementById("btnResetTempo");

  const btnEnviarDica = document.getElementById("btnEnviarDica");
  const btnEnviarChute = document.getElementById("btnEnviarChute");

  const scoreContainer = document.getElementById("scoreContainer");
  const doadorEl = document.getElementById("doador");
  const doadorFoto = document.getElementById("doadorFoto");
  const adivinhadorEl = document.getElementById("adivinhador");
  const adivinhadorFoto = document.getElementById("adivinhadorFoto");
  const palavraSecretaEl = document.getElementById("palavraSecreta");
  const conteudoPalavraEl = document.getElementById("conteudoPalavra");
  const tempoRestanteEl = document.getElementById("tempoRestante");
  const campoDica = document.getElementById("campoDica");
  const campoChute = document.getElementById("campoChute");
  const historicoAcoes = document.getElementById("historicoAcoes");

  const endResultado = document.getElementById("resultado");
  const endPontuacaoFinal = document.getElementById("pontuacaoFinal");
  const winnerBox = document.getElementById("winnerBox");
  const winnerPhotos = document.getElementById("winnerPhotos");
  const btnSair = document.getElementById("btnSair");
  const btnCompartilhar = document.getElementById("btnCompartilhar");

  const togglePalavraCheckbox = document.getElementById("togglePalavra");
  const eyeIcon = document.getElementById("eyeIcon");

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CONFETTI SETUP
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  const confettiCanvas = document.getElementById("confettiCanvas");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });

  // Função para lançar confetti
  function launchConfetti(duration = 2000) {
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 5,
        angle: Math.random() * 60 + 100,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.3 },
        useWorker: true
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // Função para celebrar acerto com animação
  function celebrarAcerto(duplaIndex) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 flex items-center justify-center z-50 pointer-events-none";

    const duoContainer = document.createElement("div");
    duoContainer.className = "flex items-center gap-8";

    const [p1, p2] = duplas[duplaIndex];
    [p1, p2].forEach(pl => {
      const imgEl = document.createElement("img");
      imgEl.src = pl.photo || "https://via.placeholder.com/64";
      imgEl.alt = "Foto";
      imgEl.className = "object-cover rounded-full";
      imgEl.style.width = "192px";
      imgEl.style.height = "192px";
      imgEl.style.animation = "growAndFade 2s forwards";
      duoContainer.appendChild(imgEl);
    });

    overlay.appendChild(duoContainer);
    document.body.appendChild(overlay);

    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 2000);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     REGRAS (MODAL)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnRegras.addEventListener("click", () => {
    modalRegras.classList.remove("hidden");
    modalRegras.classList.add("flex");
    modalRegras.querySelector('.bg-white').classList.add('modal-content');
    setTimeout(() => {
      modalRegras.classList.add('modal-visible');
    }, 10);
  });

  btnFecharModal.addEventListener("click", () => {
    modalRegras.classList.remove('modal-visible');
    setTimeout(() => {
      modalRegras.classList.add("hidden");
      modalRegras.classList.remove("flex");
    }, 300);
  });

  btnFalarRegras.addEventListener("click", () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = "1) Forme duplas de jogadores. 2) A dupla que inicia pode ganhar 2 pontos se acertar de primeira. 3) Se errar, valem 1 ponto. 4) Se pular ou o tempo acabar, passa para a próxima dupla. 5) Os jogadores alternam entre dar dicas e adivinhar. 6) Ao final, a dupla com mais pontos vence.";
    msg.lang = "pt-BR";
    speechSynthesis.speak(msg);
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     MODO DUPLAS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  document.getElementById("btnModoAleatorio").addEventListener("click", (e) => {
    modoDuplas = e.target.dataset.modo; // "aleatorio"
    e.target.classList.add("bg-blue-300");
    document.getElementById("btnModoSequencial").classList.remove("bg-blue-300");
  });

  document.getElementById("btnModoSequencial").addEventListener("click", (e) => {
    modoDuplas = e.target.dataset.modo; // "manual"
    e.target.classList.add("bg-blue-300");
    document.getElementById("btnModoAleatorio").classList.remove("bg-blue-300");
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     INICIAR / ENCERRAR / SAIR
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnIniciar.addEventListener("click", iniciarJogo);
  btnEncerrar.addEventListener("click", encerrarPartida);
  btnSair.addEventListener("click", sairParaConfig);

  // Função para obter o idioma selecionado
  function getSelectedIdioma() {
    const radio = document.querySelector('input[name="idiomaRadio"]:checked');
    return radio ? radio.value : "PT-BR";
  }

  // Função para iniciar o jogo
  function iniciarJogo() {
    if (jogadores.length < 4 || jogadores.length % 2 !== 0) {
      alert("É necessário ter ao menos 4 jogadores (número par).");
      return;
    }
    // Reset das variáveis
    duplas = [];
    scores = [];
    palavrasRodada = [];
    indicePalavra = 0;
    duplaAtual = 0;
    primeiraTentativa = true;
    timerJaIniciado = false;
    inverterPapeis = false; // Novo: inicia com papéis normais
    pararTimer();

    // Configuração de tempo
    tempoMaximoValue = parseInt(inputTempoMaximo.value) || 60;
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");

    // Formar duplas
    let arrCopia = [...jogadores];
    if (modoDuplas === "aleatorio") shuffleArray(arrCopia);
    for (let i = 0; i < arrCopia.length; i += 2) {
      duplas.push([arrCopia[i], arrCopia[i + 1]]);
    }
    scores = new Array(duplas.length).fill(0);

    // Selecionar palavras com base no idioma
    const idioma = getSelectedIdioma();
    let lista;
    if (idioma === "PT-BR") {
      lista = bigPTBR;
    } else {
      lista = palavrasBanco[idioma] || [];
      // Se a lista do idioma for muito pequena, adicionar palavras do PT-BR
      if (lista.length < MIN_PALAVRAS_RODADA) {
        lista = [...lista, ...bigPTBR.slice(0, MIN_PALAVRAS_RODADA - lista.length)];
      }
    }
    shuffleArray(lista);

    // Garantir pelo menos MIN_PALAVRAS_RODADA palavras
    palavrasRodada = lista.slice(0, Math.max(lista.length, MIN_PALAVRAS_RODADA));

    // Resetar histórico e UI
    historico = [];
    atualizarHistoricoNaTela();

    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";

    renderPontuacao();
    atualizarDuplaNaTela();
    exibirTelaPrincipal();
    
    // Adicionar classe de destaque ao botão de iniciar tempo
    btnToggleTempo.classList.add('pulse-button');
  }

  // Função para encerrar a partida
  function encerrarPartida() {
    exibirTelaFinal();
    pararTimer();
    let maiorPontuacao = Math.max(...scores);
    let indicesMax = scores.map((v, i) => (v === maiorPontuacao ? i : -1)).filter(x => x >= 0);

    if (indicesMax.length > 1) {
      endResultado.textContent = "Temos um Empate!";
    } else {
      const [p1, p2] = duplas[indicesMax[0]];
      endResultado.textContent = "Dupla Vencedora: " + p1.name + " & " + p2.name;
    }

    endPontuacaoFinal.innerHTML = "<h2 class='font-semibold text-lg mb-3'>Pontuação Final</h2>";
    duplas.forEach((dupla, idx) => {
      const div = document.createElement("div");
      div.className = "flex items-center gap-2 my-2" + (scores[idx] === maiorPontuacao ? " bg-yellow-100 p-2 rounded-lg" : "");
      
      dupla.forEach((p) => {
        if (p.photo) {
          const img = document.createElement("img");
          img.src = p.photo;
          img.alt = "Foto";
          img.className = "w-8 h-8 object-cover rounded-full";
          div.appendChild(img);
        }
      });
      
      const sp = document.createElement("span");
      sp.textContent = dupla[0].name.toUpperCase() + " & " + dupla[1].name.toUpperCase() + ": " + scores[idx] + " pts";
      div.appendChild(sp);
      
      endPontuacaoFinal.appendChild(div);
    });

    // Exibir fotos vencedores + troféu
    winnerBox.classList.add("hidden");
    winnerPhotos.innerHTML = "";
    
    if (indicesMax.length > 0) {
      indicesMax.forEach((mx) => {
        const [p1, p2] = duplas[mx];
        [p1, p2].forEach((pl) => {
          const img = document.createElement("img");
          img.src = pl.photo || "https://via.placeholder.com/64";
          img.alt = pl.name;
          img.className = "w-16 h-16 object-cover rounded-full border-2 border-yellow-500";
          winnerPhotos.appendChild(img);
        });
      });
      
      winnerBox.classList.remove("hidden");
      launchConfetti(4000);
    }
  }

  // Função para voltar à tela de configuração
  function sairParaConfig() {
    jogadores = [];
    duplas = [];
    scores = [];
    historico = [];
    palavrasRodada = [];
    indicePalavra = 0;
    duplaAtual = 0;
    inverterPapeis = false;
    
    inputNomeJogador.value = "";
    inputFotoJogador.value = "";
    renderJogadores();
    exibirTelaConfig();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     TROCAR PALAVRA
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnTrocar.addEventListener("click", trocarPalavra);
  
  function trocarPalavra() {
    registrarHistorico("TROCAR", "Palavra trocada", getAdivinhadorName());
    pararTimer();

    // Pega uma nova palavra aleatória
    const idioma = getSelectedIdioma();
    let lista;
    if (idioma === "PT-BR") {
      lista = bigPTBR;
    } else {
      lista = palavrasBanco[idioma] || bigPTBR;
    }
    
    const randomIndex = Math.floor(Math.random() * lista.length);
    const nova = lista[randomIndex];
    palavrasRodada[indicePalavra] = nova;

    // Reset do tempo
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");

    // Atualiza a palavra na tela
    conteudoPalavraEl.textContent = nova;
    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     PULAR PALAVRA
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnPular.addEventListener("click", () => {
    registrarHistorico("PULOU", "Palavra pulada", getAdivinhadorName());
    pararTimer();
    passarParaProximaPalavra();
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     TIMER / BOTÕES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnToggleTempo.addEventListener("click", () => {
    if (timerInterval) {
      pararTimer();
      btnToggleTempo.textContent = "▶️";
    } else {
      iniciarTimer();
      btnToggleTempo.textContent = "⏸";
      btnToggleTempo.classList.remove('pulse-button');
    }
  });
  
  btnResetTempo.addEventListener("click", () => {
    pararTimer();
    btnToggleTempo.textContent = "▶️";
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");
  });

  function iniciarTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
      tempoRestante--;
      tempoRestanteEl.textContent = tempoRestante;

      if (tempoRestante <= 10) {
        tempoRestanteEl.classList.remove("text-green-600");
        tempoRestanteEl.classList.add("text-red-600");
      } else {
        tempoRestanteEl.classList.remove("text-red-600");
        tempoRestanteEl.classList.add("text-green-600");
      }
      
      if (tempoRestante <= 0) {
        pararTimer();
        btnToggleTempo.textContent = "▶️";
        registrarHistorico("PULOU", "Tempo esgotado.", getAdivinhadorName());
        passarParaProximaDuplaMesmaPalavra();
      }
    }, 1000);
  }
  
  function pararTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     DICA E CHUTE
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnEnviarDica.addEventListener("click", () => {
    const dica = campoDica.value.trim();
    if (!dica) return;
    
    registrarHistorico("DICA", dica, getDoadorName());
    campoDica.value = "";
    document.getElementById("boxDoador").classList.remove("active-turn");
    document.getElementById("boxAdiv").classList.add("active-turn");

    if (!timerJaIniciado) {
      iniciarTimer();
      btnToggleTempo.textContent = "⏸";
      btnToggleTempo.classList.remove('pulse-button');
      timerJaIniciado = true;
    }
  });
  
  btnEnviarChute.addEventListener("click", () => {
    const chute = campoChute.value.trim();
    if (!chute) return;
    
    const palavraAtual = palavrasRodada[indicePalavra];
    if (!palavraAtual) return;

    if (chute.toLowerCase() === palavraAtual.toLowerCase()) {
      // ACERTO
      const adiv = getAdivinhadorName();
      const pts = primeiraTentativa ? 2 : 1;
      registrarHistorico("ACERTO", chute, adiv, pts);
      scores[duplaAtual] += pts;
      renderPontuacao();
      launchConfetti();
      celebrarAcerto(duplaAtual);

      passarParaProximaPalavra();
      document.getElementById("boxAdiv").classList.remove("active-turn");
      document.getElementById("boxDoador").classList.add("active-turn");
    } else {
      // ERRO
      registrarHistorico("ERRO", chute, getAdivinhadorName());
      if (primeiraTentativa) primeiraTentativa = false;
      passarParaProximaDuplaMesmaPalavra();
    }
    campoChute.value = "";
  });

  // Função para passar para a próxima palavra
  function passarParaProximaPalavra() {
    indicePalavra++;
    
    // Verificar se acabaram as palavras
    if (indicePalavra >= palavrasRodada.length) {
      // Adicionar mais palavras se necessário em vez de encerrar
      const idioma = getSelectedIdioma();
      let lista;
      if (idioma === "PT-BR") {
        lista = bigPTBR;
      } else {
        lista = palavrasBanco[idioma] || bigPTBR;
      }
      
      shuffleArray(lista);
      palavrasRodada = palavrasRodada.concat(lista.slice(0, 20));
    }
    
    duplaAtual = (duplaAtual + 1) % duplas.length;
    // Novo: resetar inverterPapeis quando muda de dupla
    inverterPapeis = false;
    
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");
    
    primeiraTentativa = true;

    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";
    
    atualizarDuplaNaTela();
  }

  // Função para passar para a próxima dupla mantendo a mesma palavra
  function passarParaProximaDuplaMesmaPalavra() {
    duplaAtual = (duplaAtual + 1) % duplas.length;
    // Novo: resetar inverterPapeis quando muda de dupla
    inverterPapeis = false;
    
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");

    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";
    
    atualizarDuplaNaTela();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     EXIBIR / ESCONDER TELAS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  function exibirTelaConfig() {
    configScreen.classList.remove("hidden");
    mainScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
  }
  
  function exibirTelaPrincipal() {
    configScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    endScreen.classList.add("hidden");
  }
  
  function exibirTelaFinal() {
    configScreen.classList.add("hidden");
    mainScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     RENDER DE PONTUAÇÃO, DUPLAS, ETC.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  function atualizarDuplaNaTela() {
    // Novo: Inverter papéis dos jogadores
    let doadorIndex = inverterPapeis ? 1 : 0;
    let adivinhadorIndex = inverterPapeis ? 0 : 1;
    
    const doadorPlayer = duplas[duplaAtual][doadorIndex];
    const adivPlayer = duplas[duplaAtual][adivinhadorIndex];
    
    doadorEl.textContent = doadorPlayer.name.toUpperCase();
    adivinhadorEl.textContent = adivPlayer.name.toUpperCase();
    conteudoPalavraEl.textContent = palavrasRodada[indicePalavra] || "";

    if (doadorPlayer.photo) {
      doadorFoto.src = doadorPlayer.photo;
      doadorFoto.classList.remove("hidden");
    } else {
      doadorFoto.classList.add("hidden");
    }
    
    if (adivPlayer.photo) {
      adivinhadorFoto.src = adivPlayer.photo;
      adivinhadorFoto.classList.remove("hidden");
    } else {
      adivinhadorFoto.classList.add("hidden");
    }

    document.getElementById("boxDoador").classList.remove("active-turn");
    document.getElementById("boxAdiv").classList.remove("active-turn");
    document.getElementById("boxDoador").classList.add("active-turn");
    
    // Limpar campos de entrada
    campoDica.value = "";
    campoChute.value = "";
    
    // Pausar timer quando mudar de dupla
    pararTimer();
    btnToggleTempo.textContent = "▶️";
    btnToggleTempo.classList.add('pulse-button');
  }

  function renderPontuacao() {
    scoreContainer.innerHTML = "";
    
    duplas.forEach((dupla, idx) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2 bg-white rounded p-2 shadow" + 
                     (idx === duplaAtual ? " border-2 border-blue-500" : "");

      dupla.forEach((p) => {
        if (p.photo) {
          const img = document.createElement("img");
          img.src = p.photo;
          img.alt = "Foto";
          img.className = "w-12 h-12 object-cover rounded-full player-photo";
          row.appendChild(img);
        }
      });
      
      const nomes = document.createElement("span");
      nomes.className = "font-bold text-sm ml-2";
      nomes.textContent = dupla[0].name.toUpperCase() + " & " + dupla[1].name.toUpperCase();
      row.appendChild(nomes);

      const pts = document.createElement("span");
      pts.className = "text-blue-700 font-extrabold text-lg ml-auto";
      pts.textContent = `${scores[idx]} pts`;
      row.appendChild(pts);

      scoreContainer.appendChild(row);
    });
  }

  // Histórico com cores diferentes
  function registrarHistorico(acao, texto, jogador, pontos) {
    const currentWord = palavrasRodada[indicePalavra] || "";
    historico.push({ acao, texto, jogador, points: pontos, palavra: currentWord });
    atualizarHistoricoNaTela();
  }
  
  function atualizarHistoricoNaTela() {
    historicoAcoes.innerHTML = "";
    
    historico.forEach((h) => {
      let mensagem = "";
      let icone = "";
      let bgClass = "bg-gray-100"; // default

      // Distinção de cor no histórico
      if (h.acao === "DICA") {
        icone = "💡";
        mensagem = `${icone} ${h.jogador}: "${h.texto}"`;
        bgClass = "bg-blue-100"; // dica em azul clarinho
      } 
      else if (h.acao === "ERRO") {
        icone = "❌";
        mensagem = `${icone} ${h.jogador}: "${h.texto}"`;
        bgClass = "bg-red-100"; // erro em vermelho clarinho
      }
      else if (h.acao === "ACERTO") {
        icone = "✅";
        mensagem = `${icone} ${h.jogador} +${h.points || 0} pts`;
        bgClass = "bg-green-100"; // acerto em verde clarinho
      }
      else if (h.acao === "PULOU") {
        icone = "⏭️";
        mensagem = `${icone} ${h.jogador}: ${h.texto}`;
        bgClass = "bg-yellow-100"; // pular em amarelo clarinho
      }
      else if (h.acao === "TROCAR") {
        icone = "🔀";
        mensagem = `${icone} ${h.jogador}: ${h.texto}`;
        bgClass = "bg-purple-100"; // trocar em roxo clarinho
      }

      const secretIcon = document.createElement("span");
      secretIcon.textContent = "👁️";
      secretIcon.className = "ml-2 text-blue-700 hover-scale";
      secretIcon.title = "Ver palavra secreta";
      secretIcon.addEventListener("click", () => {
        alert(`A palavra secreta era: ${h.palavra}`);
      });

      // Card do histórico
      const card = document.createElement("div");
      card.className = `${bgClass} border border-gray-300 rounded p-2 min-w-[120px] text-sm flex items-center history-card`;
      card.textContent = mensagem;
      card.appendChild(secretIcon);

      historicoAcoes.appendChild(card);
    });
    
    // Rola automaticamente para o fim do histórico
    historicoAcoes.scrollLeft = historicoAcoes.scrollWidth;
  }

  // Funções auxiliares para obter nomes dos jogadores
  function getDoadorName() {
    // Novo: Considerar a inversão de papéis
    const doadorIndex = inverterPapeis ? 1 : 0;
    return duplas[duplaAtual][doadorIndex].name.toUpperCase();
  }
  
  function getAdivinhadorName() {
    // Novo: Considerar a inversão de papéis
    const adivinhadorIndex = inverterPapeis ? 0 : 1;
    return duplas[duplaAtual][adivinhadorIndex].name.toUpperCase();
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     PALAVRA SECRETA (OLHINHO)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  togglePalavraCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      palavraSecretaEl.classList.remove("hidden");
      eyeIcon.textContent = "👁️";
    } else {
      palavraSecretaEl.classList.add("hidden");
      eyeIcon.textContent = "🙈";
    }
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     CÂMERA
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnAbrirCamera.addEventListener("click", async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoCamera.srcObject = cameraStream;
      videoCamera.classList.remove("hidden");
      btnCapturarFoto.classList.remove("hidden");
      canvasFoto.classList.add("hidden");
    } catch (e) {
      alert("Não foi possível acessar a câmera: " + e);
    }
  });
  
  btnCapturarFoto.addEventListener("click", () => {
    if (!cameraStream) return;
    
    canvasFoto.classList.remove("hidden");
    canvasFoto.width = videoCamera.videoWidth;
    canvasFoto.height = videoCamera.videoHeight;
    
    const ctx = canvasFoto.getContext("2d");
    ctx.drawImage(videoCamera, 0, 0, canvasFoto.width, canvasFoto.height);
    
    let dataUrl = canvasFoto.toDataURL("image/png");
    videoCamera.classList.add("hidden");
    btnCapturarFoto.classList.add("hidden");
    
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    tempFotoDataUrl = dataUrl;
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ADICIONAR JOGADOR
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnAdicionarJogador.addEventListener("click", adicionarJogador);
  
  function adicionarJogador() {
    if (jogadores.length >= 10) {
      alert("Máximo de 10 jogadores atingido!");
      return;
    }
    
    let nome = inputNomeJogador.value.trim() || `Convidado #${jogadores.length + 1}`;
    let colorClass = colorPalette[jogadores.length % colorPalette.length];
    let foto = "";
    const file = inputFotoJogador.files[0];

    if (tempFotoDataUrl) {
      foto = tempFotoDataUrl;
      tempFotoDataUrl = "";
    } else if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        foto = ev.target.result;
        pushJogador(nome, colorClass, foto);
      };
      reader.readAsDataURL(file);
      return;
    }
    
    pushJogador(nome, colorClass, foto);
  }
  
  const colorPalette = [
    "bg-red-200 text-red-800",
    "bg-green-200 text-green-800",
    "bg-yellow-200 text-yellow-800",
    "bg-purple-200 text-purple-800",
    "bg-pink-200 text-pink-800",
    "bg-orange-200 text-orange-800",
    "bg-blue-200 text-blue-800",
    "bg-teal-200 text-teal-800"
  ];
  
  function pushJogador(name, color, photo) {
    jogadores.push({ name, color, photo });
    inputNomeJogador.value = "";
    inputFotoJogador.value = "";
    renderJogadores();
  }
  
  function removerJogador(idx) {
    jogadores.splice(idx, 1);
    renderJogadores();
  }
  
  function renderJogadores() {
    listaJogadoresEl.innerHTML = "";
    
    jogadores.forEach((pl, i) => {
      const div = document.createElement("div");
      div.className = `${pl.color} p-2 uppercase rounded mb-1 shadow-sm font-bold flex items-center justify-between`;

      const left = document.createElement("div");
      left.className = "flex items-center gap-2";
      
      if (pl.photo) {
        const imgEl = document.createElement("img");
        imgEl.src = pl.photo;
        imgEl.alt = "Foto";
        imgEl.className = "w-8 h-8 object-cover rounded-full";
        left.appendChild(imgEl);
      }
      
      const sp = document.createElement("span");
      sp.textContent = pl.name;
      left.appendChild(sp);

      div.appendChild(left);

      const btnRem = document.createElement("button");
      btnRem.textContent = "X";
      btnRem.className = "bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded font-bold";
      btnRem.addEventListener("click", () => removerJogador(i));
      div.appendChild(btnRem);

      listaJogadoresEl.appendChild(div);
    });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     COMPARTILHAR
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnCompartilhar.addEventListener("click", () => {
    const mensagem = `Fui campeão no jogo "Qual é a Palavra?"! Venha jogar você também!`;
    
    // Tentar usar Web Share API se disponível
    if (navigator.share) {
      navigator.share({
        title: 'Qual é a Palavra?',
        text: mensagem,
        url: window.location.href,
      })
      .catch((error) => {
        console.log('Erro ao compartilhar:', error);
        compartilharWhatsApp(mensagem);
      });
    } else {
      compartilharWhatsApp(mensagem);
    }
  });
  
  function compartilharWhatsApp(mensagem) {
    const linkWhats = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhats, "_blank");
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     SHUFFLE
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     EVENTOS PARA TELAS PEQUENAS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // Melhorar experiência em telas pequenas
  function ajustarLayoutParaTelaPequena() {
    if (window.innerWidth < 640) {
      // Adicionar classes para melhor visualização em telas pequenas
      document.querySelectorAll('.md\\:flex-row').forEach(el => {
        el.classList.add('mobile-stack');
      });
    } else {
      document.querySelectorAll('.mobile-stack').forEach(el => {
        el.classList.remove('mobile-stack');
      });
    }
  }

  window.addEventListener('resize', ajustarLayoutParaTelaPequena);
  
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     AUTO-ALTERNÂNCIA DE PAPÉIS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // Novo: Alternância automática dos papéis a cada nova palavra
  document.addEventListener('keydown', function(e) {
    // Atalho para alternar papéis manualmente (Ctrl+P)
    if (e.ctrlKey && e.key === 'p' && mainScreen.classList.contains('hidden') === false) {
      inverterPapeis = !inverterPapeis;
      atualizarDuplaNaTela();
      alert('Papéis alternados manualmente!');
    }
  });

  // Adicionar evento ao botão de troca
  btnEnviarChute.addEventListener('click', function() {
    // Se acertar, a função de acerto já vai chamar passarParaProximaPalavra()
    // Se errar, vamos definir que na próxima rodada desta dupla, os papéis serão invertidos
    if (!campoChute.value.trim()) return;
    
    const palavraAtual = palavrasRodada[indicePalavra];
    if (!palavraAtual) return;
    
    if (campoChute.value.trim().toLowerCase() !== palavraAtual.toLowerCase()) {
      // Se for erro, inverte papéis na próxima vez
      inverterPapeis = !inverterPapeis;
    }
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     INICIA NA TELA CONFIG
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  exibirTelaConfig();
  ajustarLayoutParaTelaPequena();
  
  // Notificação de boas-vindas
  setTimeout(() => {
    if (!btnRegras.classList.contains('clicked')) {
      btnRegras.classList.add('pulse-button');
      setTimeout(() => {
        btnRegras.classList.remove('pulse-button');
      }, 5000);
    }
  }, 2000);
  
  btnRegras.addEventListener('click', function() {
    this.classList.remove('pulse-button');
    this.classList.add('clicked');
  });

})();
