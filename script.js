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
  
  // NOVO: Controle de alternância de papéis (0: jogador1 dá dica, 1: jogador2 dá dica)
  let papelAtual = [];  // Array para armazenar o papel atual de cada dupla ([0,0,0] indica que o primeiro jogador de cada dupla dá dica)

  // Quantidade mínima de palavras por rodada
  const MIN_PALAVRAS_RODADA = 50;

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     LISTA DE PALAVRAS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // Lista principal de palavras em português do Brasil
  const palavrasList = [
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
    "Alegria", "Tristeza", "Raiva", "Medo", "Amor", "Saudade", "Esperança", "Ansiedade", "Paz", "Felicidade",
    
    // Objetos variados
    "Chave", "Cinto", "Livro", "Caneta", "Lápis", "Borracha", "Martelo", "Tesoura", "Panela", "Garfo",
    "Colher", "Faca", "Prato", "Copo", "Garrafa", "Escada", "Remédio", "Perfume", "Sabonete", "Toalha",
    
    // Elementos da natureza
    "Lago", "Ilha", "Deserto", "Iceberg", "Caverna", "Vale", "Areia", "Pedra", "Diamante", "Ouro",
    "Prata", "Bronze", "Metal", "Madeira", "Plástico", "Vidro", "Papel", "Algodão", "Seda", "Couro",
    
    // Mais palavras comuns
    "Tempo", "Rua", "Avenida", "Praça", "Mercado", "Loja", "Banco", "Correio", "Hospital", "Farmácia",
    "Padaria", "Livraria", "Biblioteca", "Restaurante", "Café", "Hotel", "Aeroporto", "Estação", "Porto",
    "Jardim", "Piscina", "Ginásio", "Estádio", "Palco", "Teatro", "Música", "Dança", "Poesia", "Romance",
    "Comédia", "Drama", "Terror", "Aventura", "Ficção", "Documentário", "Notícia", "Revista", "Jornal"
  ];

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
  
  const palavraAtualEl = document.getElementById("palavraAtual");
  const duplaAtualIndicador = document.getElementById("duplaAtualIndicador");
  const ultimoEvento = document.getElementById("ultimoEvento");
  const ultimoEventoConteudo = document.getElementById("ultimoEventoConteudo");

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
        colors: ['#4f46e5', '#a855f7', '#3b82f6', '#10b981'],
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
      imgEl.style.border = "4px solid #4f46e5";
      imgEl.style.boxShadow = "0 0 20px rgba(79, 70, 229, 0.6)";
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
    e.target.classList.add("bg-indigo-100");
    e.target.classList.add("text-indigo-800");
    e.target.classList.add("border-indigo-400");
    document.getElementById("btnModoSequencial").classList.remove("bg-indigo-100");
    document.getElementById("btnModoSequencial").classList.remove("text-indigo-800");
    document.getElementById("btnModoSequencial").classList.remove("border-indigo-400");
  });

  document.getElementById("btnModoSequencial").addEventListener("click", (e) => {
    modoDuplas = e.target.dataset.modo; // "manual"
    e.target.classList.add("bg-indigo-100");
    e.target.classList.add("text-indigo-800");
    e.target.classList.add("border-indigo-400");
    document.getElementById("btnModoAleatorio").classList.remove("bg-indigo-100");
    document.getElementById("btnModoAleatorio").classList.remove("text-indigo-800");
    document.getElementById("btnModoAleatorio").classList.remove("border-indigo-400");
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     INICIAR / ENCERRAR / SAIR
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnIniciar.addEventListener("click", iniciarJogo);
  btnEncerrar.addEventListener("click", encerrarPartida);
  btnSair.addEventListener("click", sairParaConfig);

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
    papelAtual = []; // Reset dos papéis
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
      // NOVO: Inicializar papéis para cada dupla (0 = primeiro jogador dá dica, 1 = segundo jogador dá dica)
      papelAtual.push(0);
    }
    scores = new Array(duplas.length).fill(0);

    // Selecionar palavras para o jogo
    shuffleArray(palavrasList);
    palavrasRodada = palavrasList.slice(0, Math.max(MIN_PALAVRAS_RODADA, palavrasList.length));

    // Resetar histórico e UI
    historico = [];
    atualizarHistoricoNaTela();
    
    palavraAtualEl.textContent = (indicePalavra + 1);
    atualizarDuplaAtualIndicador();

    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";

    renderPontuacao();
    atualizarDuplaNaTela();
    exibirTelaPrincipal();
    
    // Adicionar classe de destaque ao botão de iniciar tempo
    btnToggleTempo.classList.add('pulse-button');
    
    // Feedback visual e sonoro de início
    launchConfetti(1000);
    mostrarMensagem("Jogo iniciado! Vamos lá!", "success");
  }

  // Função para encerrar a partida
  function encerrarPartida() {
    exibirTelaFinal();
    pararTimer();
    let maiorPontuacao = Math.max(...scores);
    let indicesMax = scores.map((v, i) => (v === maiorPontuacao ? i : -1)).filter(x => x >= 0);

    if (indicesMax.length > 1) {
      endResultado.textContent = "Temos um Empate!";
      endResultado.innerHTML = '<i class="fas fa-trophy text-yellow-500 mr-2"></i> Temos um Empate!';
    } else {
      const [p1, p2] = duplas[indicesMax[0]];
      endResultado.innerHTML = '<i class="fas fa-trophy text-yellow-500 mr-2"></i> Dupla Vencedora: <span class="font-bold text-indigo-700">' + p1.name + ' & ' + p2.name + '</span>';
    }

    endPontuacaoFinal.innerHTML = '<h2 class="font-semibold text-lg mb-3 text-indigo-700"><i class="fas fa-chart-bar mr-2"></i> Pontuação Final</h2><div class="bg-white p-3 rounded-lg shadow-inner">';
    duplas.forEach((dupla, idx) => {
      const div = document.createElement("div");
      div.className = "flex items-center gap-2 my-3 p-3 rounded-lg" + (scores[idx] === maiorPontuacao ? " bg-yellow-100 border-l-4 border-yellow-500" : " border-l-4 border-gray-200");
      
      dupla.forEach((p) => {
        if (p.photo) {
          const img = document.createElement("img");
          img.src = p.photo;
          img.alt = "Foto";
          img.className = "w-10 h-10 object-cover rounded-full border-2" + (scores[idx] === maiorPontuacao ? " border-yellow-400" : " border-gray-200");
          div.appendChild(img);
        }
      });
      
      const sp = document.createElement("span");
      sp.className = "flex-grow text-lg" + (scores[idx] === maiorPontuacao ? " font-bold text-yellow-800" : "");
      sp.textContent = dupla[0].name.toUpperCase() + " & " + dupla[1].name.toUpperCase();
      div.appendChild(sp);
      
      const pts = document.createElement("span");
      pts.className = "text-2xl font-extrabold" + (scores[idx] === maiorPontuacao ? " text-yellow-600" : " text-indigo-600");
      pts.textContent = scores[idx] + " pts";
      div.appendChild(pts);
      
      endPontuacaoFinal.appendChild(div);
    });
    endPontuacaoFinal.innerHTML += '</div>';

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
          img.className = "w-20 h-20 object-cover rounded-full border-4 border-yellow-400 shadow-lg";
          winnerPhotos.appendChild(img);
        });
      });
      
      winnerBox.classList.remove("hidden");
      launchConfetti(6000);
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
    papelAtual = [];
    
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
    const adivinhadorNome = getAdivinhadorName();
    registrarHistorico("TROCAR", "Palavra trocada", adivinhadorNome);
    pararTimer();

    // Pega uma nova palavra aleatória
    const randomIndex = Math.floor(Math.random() * palavrasList.length);
    const nova = palavrasList[randomIndex];
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
    
    mostrarMensagem("A palavra foi trocada!", "warning");
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     PULAR PALAVRA
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnPular.addEventListener("click", () => {
    const adivinhadorNome = getAdivinhadorName();
    registrarHistorico("PULOU", "Palavra pulada", adivinhadorNome);
    pararTimer();
    passarParaProximaPalavra();
    
    mostrarMensagem("Palavra pulada! Próxima dupla.", "info");
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     TIMER / BOTÕES
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnToggleTempo.addEventListener("click", () => {
    if (timerInterval) {
      pararTimer();
      btnToggleTempo.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      iniciarTimer();
      btnToggleTempo.innerHTML = '<i class="fas fa-pause"></i>';
      btnToggleTempo.classList.remove('pulse-button');
    }
  });
  
  btnResetTempo.addEventListener("click", () => {
    pararTimer();
    btnToggleTempo.innerHTML = '<i class="fas fa-play"></i>';
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");
    
    mostrarMensagem("Tempo reiniciado!", "info");
  });

  function iniciarTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
      tempoRestante--;
      tempoRestanteEl.textContent = tempoRestante;

      if (tempoRestante <= 10) {
        tempoRestanteEl.classList.remove("text-green-600");
        tempoRestanteEl.classList.add("text-red-600");
        
        // Feedback visual para tempo acabando
        if (tempoRestante <= 5) {
          tempoRestanteEl.classList.add("animate-pulse");
        }
      } else {
        tempoRestanteEl.classList.remove("text-red-600");
        tempoRestanteEl.classList.add("text-green-600");
        tempoRestanteEl.classList.remove("animate-pulse");
      }
      
      if (tempoRestante <= 0) {
        pararTimer();
        btnToggleTempo.innerHTML = '<i class="fas fa-play"></i>';
        registrarHistorico("PULOU", "Tempo esgotado", getAdivinhadorName());
        passarParaProximaDuplaMesmaPalavra();
        
        mostrarMensagem("Tempo esgotado! Próxima dupla.", "danger");
      }
    }, 1000);
  }
  
  function pararTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      tempoRestanteEl.classList.remove("animate-pulse");
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     DICA E CHUTE
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnEnviarDica.addEventListener("click", () => {
    const dica = campoDica.value.trim();
    if (!dica) {
      mostrarMensagem("Digite uma dica antes de enviar!", "warning");
      campoDica.focus();
      return;
    }
    
    const doadorNome = getDoadorName();
    registrarHistorico("DICA", dica, doadorNome);
    campoDica.value = "";
    document.getElementById("boxDoador").classList.remove("active-turn-box");
    document.getElementById("boxAdiv").classList.add("active-turn-box");

    if (!timerJaIniciado) {
      iniciarTimer();
      btnToggleTempo.innerHTML = '<i class="fas fa-pause"></i>';
      btnToggleTempo.classList.remove('pulse-button');
      timerJaIniciado = true;
    }
    
    mostrarMensagem(`${doadorNome} enviou a dica: "${dica}"`, "info");
  });
  
  btnEnviarChute.addEventListener("click", () => {
    const chute = campoChute.value.trim();
    if (!chute) {
      mostrarMensagem("Digite um chute antes de enviar!", "warning");
      campoChute.focus();
      return;
    }
    
    const palavraAtual = palavrasRodada[indicePalavra];
    if (!palavraAtual) return;

    if (chute.toLowerCase() === palavraAtual.toLowerCase()) {
      // ACERTO
      const adivNome = getAdivinhadorName();
      const pts = primeiraTentativa ? 2 : 1;
      registrarHistorico("ACERTO", chute, adivNome, pts);
      scores[duplaAtual] += pts;
      renderPontuacao();
      launchConfetti();
      celebrarAcerto(duplaAtual);
      
      // Inverter papéis para a próxima rodada desta dupla
      alternarPapelDupla(duplaAtual);
      
      passarParaProximaPalavra();
      document.getElementById("boxAdiv").classList.remove("active-turn-box");
      document.getElementById("boxDoador").classList.add("active-turn-box");
      
      mostrarMensagem(`${adivNome} ACERTOU e ganhou ${pts} pontos!`, "success");
    } else {
      // ERRO
      const adivNome = getAdivinhadorName();
      registrarHistorico("ERRO", chute, adivNome);
      if (primeiraTentativa) primeiraTentativa = false;
      
      // CORREÇÃO: Não alternar papéis quando erra, pois a palavra continua a mesma
      // A alternância só ocorre quando muda de palavra
      
      passarParaProximaDuplaMesmaPalavra();
      
      mostrarMensagem(`${adivNome} errou! Resposta: "${chute}"`, "danger");
    }
    campoChute.value = "";
  });

  // NOVO: Função para alternar papel de uma dupla (quem dá dica vs. quem adivinha)
  function alternarPapelDupla(indiceDupla) {
    // Se antes era 0 (primeiro jogador dá dica), agora é 1 (segundo jogador dá dica)
    // E vice-versa
    papelAtual[indiceDupla] = (papelAtual[indiceDupla] === 0) ? 1 : 0;
  }

  // Função para passar para a próxima palavra
  function passarParaProximaPalavra() {
    indicePalavra++;
    
    // Verificar se acabaram as palavras
    if (indicePalavra >= palavrasRodada.length) {
      // Adicionar mais palavras se necessário em vez de encerrar
      shuffleArray(palavrasList);
      palavrasRodada = palavrasRodada.concat(palavrasList.slice(0, 20));
    }
    
    // Atualizar contador de palavra atual
    palavraAtualEl.textContent = (indicePalavra + 1);
    
    // Passar para a próxima dupla
    duplaAtual = (duplaAtual + 1) % duplas.length;
    
    // Atualizar o indicador da dupla atual
    atualizarDuplaAtualIndicador();
    
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");
    tempoRestanteEl.classList.remove("animate-pulse");
    
    primeiraTentativa = true;

    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";
    
    atualizarDuplaNaTela();
  }

  // Função para passar para a próxima dupla mantendo a mesma palavra
  function passarParaProximaDuplaMesmaPalavra() {
    duplaAtual = (duplaAtual + 1) % duplas.length;
    
    // Atualizar o indicador da dupla atual
    atualizarDuplaAtualIndicador();
    
    // CORREÇÃO: Não alternar papéis se a palavra continuar a mesma
    // Quando a palavra é a mesma, quem dá a dica continua dando a dica
    
    tempoRestante = tempoMaximoValue;
    tempoRestanteEl.textContent = tempoRestante;
    tempoRestanteEl.classList.remove("text-red-600");
    tempoRestanteEl.classList.add("text-green-600");
    tempoRestanteEl.classList.remove("animate-pulse");

    togglePalavraCheckbox.checked = false;
    palavraSecretaEl.classList.add("hidden");
    eyeIcon.textContent = "🙈";
    
    atualizarDuplaNaTela();
  }

  // Função para atualizar o indicador da dupla atual
  function atualizarDuplaAtualIndicador() {
    if (duplas.length === 0) return;
    
    const [p1, p2] = duplas[duplaAtual];
    duplaAtualIndicador.textContent = `${p1.name} & ${p2.name}`;
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
    if (duplas.length === 0) return;
    
    // NOVO: Usar o papelAtual para determinar quem dá dica e quem adivinha
    const papelDaDupla = papelAtual[duplaAtual]; // 0 ou 1
    
    // Se papelDaDupla for 0, o jogador 0 dá dica e jogador 1 adivinha
    // Se papelDaDupla for 1, o jogador 1 dá dica e jogador 0 adivinha
    const doadorIndex = papelDaDupla;
    const adivinhadorIndex = papelDaDupla === 0 ? 1 : 0;
    
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

    document.getElementById("boxDoador").classList.remove("active-turn-box");
    document.getElementById("boxAdiv").classList.remove("active-turn-box");
    document.getElementById("boxDoador").classList.add("active-turn-box");
    
    // Limpar campos de entrada
    campoDica.value = "";
    campoChute.value = "";
    
    // Pausar timer quando mudar de dupla
    pararTimer();
    btnToggleTempo.innerHTML = '<i class="fas fa-play"></i>';
    btnToggleTempo.classList.add('pulse-button');
    
    // Exibir status atual da dupla
    mostrarMensagem(`Vez da dupla: ${doadorPlayer.name} (doador) & ${adivPlayer.name} (adivinhador)`, "info");
  }

  function renderPontuacao() {
    scoreContainer.innerHTML = "";
    
    duplas.forEach((dupla, idx) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2 bg-white rounded-lg p-2 shadow" + 
                     (idx === duplaAtual ? " border-2 border-indigo-500" : "");

      dupla.forEach((p) => {
        if (p.photo) {
          const img = document.createElement("img");
          img.src = p.photo;
          img.alt = "Foto";
          img.className = "w-10 h-10 object-cover rounded-full player-photo";
          row.appendChild(img);
        }
      });
      
      const nomes = document.createElement("span");
      nomes.className = "font-semibold text-sm ml-2";
      nomes.textContent = dupla[0].name.toUpperCase() + " & " + dupla[1].name.toUpperCase();
      row.appendChild(nomes);

      const pts = document.createElement("span");
      pts.className = "text-indigo-700 font-extrabold text-lg ml-auto";
      pts.textContent = `${scores[idx]} pts`;
      row.appendChild(pts);

      scoreContainer.appendChild(row);
    });
  }

  // Função para mostrar mensagem temporária
  function mostrarMensagem(texto, tipo) {
    let icon, bgClass;
    
    switch(tipo) {
      case "success":
        icon = '<i class="fas fa-check-circle mr-2 text-green-600"></i>';
        bgClass = "bg-green-100";
        break;
      case "warning":
        icon = '<i class="fas fa-exclamation-triangle mr-2 text-amber-600"></i>';
        bgClass = "bg-amber-100";
        break;
      case "danger":
        icon = '<i class="fas fa-times-circle mr-2 text-red-600"></i>';
        bgClass = "bg-red-100";
        break;
      case "info":
      default:
        icon = '<i class="fas fa-info-circle mr-2 text-indigo-600"></i>';
        bgClass = "bg-indigo-100";
    }
    
    ultimoEventoConteudo.innerHTML = icon + texto;
    ultimoEvento.className = `mt-4 ${bgClass} p-3 rounded-lg shadow-sm`;
    ultimoEvento.classList.remove("hidden");
    ultimoEvento.classList.add("highlight-latest");
    
    // Após 5 segundos, remover o destaque
    setTimeout(() => {
      ultimoEvento.classList.remove("highlight-latest");
    }, 5000);
  }

  // Histórico com cores diferentes
  function registrarHistorico(acao, texto, jogador, pontos) {
    const currentWord = palavrasRodada[indicePalavra] || "";
    historico.push({ acao, texto, jogador, points: pontos, palavra: currentWord });
    atualizarHistoricoNaTela();
  }
  
  function atualizarHistoricoNaTela() {
    historicoAcoes.innerHTML = "";
    
    historico.forEach((h, index) => {
      let mensagem = "";
      let icone = "";
      let bgClass = "bg-gray-100";
      let borderClass = "";
      
      // Distinção de cor no histórico
      if (h.acao === "DICA") {
        icone = '<i class="fas fa-lightbulb text-yellow-500"></i>';
        mensagem = `${icone} ${h.jogador}: "${h.texto}"`;
        bgClass = "bg-blue-50";
        borderClass = "dica-card";
      } 
      else if (h.acao === "ERRO") {
        icone = '<i class="fas fa-times-circle text-red-500"></i>';
        mensagem = `${icone} ${h.jogador}: "${h.texto}"`;
        bgClass = "bg-red-50";
        borderClass = "erro-card";
      }
      else if (h.acao === "ACERTO") {
        icone = '<i class="fas fa-check-circle text-green-500"></i>';
        mensagem = `${icone} ${h.jogador} <span class="font-bold text-green-600">+${h.points || 0} pts</span>`;
        bgClass = "bg-green-50";
        borderClass = "acerto-card";
      }
      else if (h.acao === "PULOU") {
        icone = '<i class="fas fa-forward text-amber-500"></i>';
        mensagem = `${icone} ${h.jogador}: ${h.texto}`;
        bgClass = "bg-amber-50";
        borderClass = "pular-card";
      }
      else if (h.acao === "TROCAR") {
        icone = '<i class="fas fa-sync-alt text-purple-500"></i>';
        mensagem = `${icone} ${h.jogador}: ${h.texto}`;
        bgClass = "bg-purple-50";
        borderClass = "trocar-card";
      }

      const secretIcon = document.createElement("span");
      secretIcon.innerHTML = '<i class="fas fa-eye text-indigo-500"></i>';
      secretIcon.className = "ml-2 hover-scale";
      secretIcon.title = "Ver palavra secreta";
      secretIcon.addEventListener("click", () => {
        alert(`A palavra secreta era: ${h.palavra}`);
      });

      // Card do histórico
      const card = document.createElement("div");
      card.className = `${bgClass} ${borderClass} rounded-lg p-2 min-w-[150px] text-sm flex items-center justify-between history-card shadow-sm`;
      
      const messageSpan = document.createElement("span");
      messageSpan.innerHTML = mensagem;
      card.appendChild(messageSpan);
      card.appendChild(secretIcon);

      // Destacar o último cartão de histórico
      if (index === historico.length - 1) {
        card.classList.add("highlight-latest");
      }

      historicoAcoes.appendChild(card);
    });
    
    // Rola automaticamente para o fim do histórico
    historicoAcoes.scrollLeft = historicoAcoes.scrollWidth;
    
    // Atualizar último evento com o evento mais recente
    if (historico.length > 0) {
      const ultimo = historico[historico.length - 1];
      let tipo;
      
      switch(ultimo.acao) {
        case "ACERTO":
          tipo = "success";
          break;
        case "ERRO":
          tipo = "danger";
          break;
        case "PULOU":
        case "TROCAR":
          tipo = "warning";
          break;
        case "DICA":
        default:
          tipo = "info";
      }
      
      let mensagem;
      if (ultimo.acao === "ACERTO") {
        mensagem = `${ultimo.jogador} acertou e ganhou ${ultimo.points} pontos!`;
      } else if (ultimo.acao === "ERRO") {
        mensagem = `${ultimo.jogador} errou. Resposta: "${ultimo.texto}"`;
      } else if (ultimo.acao === "DICA") {
        mensagem = `${ultimo.jogador} deu a dica: "${ultimo.texto}"`;
      } else {
        mensagem = `${ultimo.jogador}: ${ultimo.texto}`;
      }
      
      mostrarMensagem(mensagem, tipo);
    }
  }

  // Funções auxiliares para obter nomes dos jogadores
  function getDoadorName() {
    if (duplas.length === 0) return "";
    
    // NOVO: Usar o papelAtual para determinar quem dá dica
    const papelDaDupla = papelAtual[duplaAtual]; // 0 ou 1
    const doadorIndex = papelDaDupla;
    
    return duplas[duplaAtual][doadorIndex].name.toUpperCase();
  }
  
  function getAdivinhadorName() {
    if (duplas.length === 0) return "";
    
    // NOVO: Usar o papelAtual para determinar quem adivinha
    const papelDaDupla = papelAtual[duplaAtual]; // 0 ou 1
    const adivinhadorIndex = papelDaDupla === 0 ? 1 : 0;
    
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
    
    mostrarMensagem("Foto capturada com sucesso!", "success");
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ADICIONAR JOGADOR
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  btnAdicionarJogador.addEventListener("click", adicionarJogador);
  
  // Evento de tecla Enter para adicionar jogador
  inputNomeJogador.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      adicionarJogador();
    }
  });
  
  function adicionarJogador() {
    if (jogadores.length >= 10) {
      mostrarMensagem("Máximo de 10 jogadores atingido!", "warning");
      return;
    }
    
    let nome = inputNomeJogador.value.trim() || `Jogador ${jogadores.length + 1}`;
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
    "bg-indigo-100 text-indigo-800",
    "bg-green-100 text-green-800",
    "bg-amber-100 text-amber-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-orange-100 text-orange-800",
    "bg-blue-100 text-blue-800",
    "bg-teal-100 text-teal-800"
  ];
  
  function pushJogador(name, color, photo) {
    jogadores.push({ name, color, photo });
    inputNomeJogador.value = "";
    inputFotoJogador.value = "";
    renderJogadores();
    mostrarMensagem(`Jogador "${name}" adicionado com sucesso!`, "success");
  }
  
  function removerJogador(idx) {
    const nomeJogador = jogadores[idx].name;
    jogadores.splice(idx, 1);
    renderJogadores();
    mostrarMensagem(`Jogador "${nomeJogador}" removido!`, "info");
  }
  
  function renderJogadores() {
    listaJogadoresEl.innerHTML = "";
    
    if (jogadores.length === 0) {
      const msgVazia = document.createElement("div");
      msgVazia.className = "text-center p-4 text-gray-500 italic";
      msgVazia.innerHTML = '<i class="fas fa-users-slash mr-2"></i> Nenhum jogador adicionado';
      listaJogadoresEl.appendChild(msgVazia);
      return;
    }
    
    jogadores.forEach((pl, i) => {
      const div = document.createElement("div");
      div.className = `${pl.color} p-3 rounded-lg mb-2 shadow-sm font-bold flex items-center justify-between transition-all hover:shadow-md`;

      const left = document.createElement("div");
      left.className = "flex items-center gap-3";
      
      if (pl.photo) {
        const imgEl = document.createElement("img");
        imgEl.src = pl.photo;
        imgEl.alt = "Foto";
        imgEl.className = "w-10 h-10 object-cover rounded-full shadow-sm";
        left.appendChild(imgEl);
      } else {
        // Avatar de placeholder se não tiver foto
        const avatar = document.createElement("div");
        avatar.className = "w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm";
        avatar.textContent = pl.name.substring(0, 1).toUpperCase();
        left.appendChild(avatar);
      }
      
      const sp = document.createElement("span");
      sp.textContent = pl.name;
      left.appendChild(sp);

      div.appendChild(left);

      const btnRem = document.createElement("button");
      btnRem.innerHTML = '<i class="fas fa-trash-alt"></i>';
      btnRem.className = "bg-red-400 hover:bg-red-500 text-white p-2 rounded-full shadow-sm transition-all hover:shadow";
      btnRem.title = "Remover jogador";
      btnRem.addEventListener("click", () => removerJogador(i));
      div.appendChild(btnRem);

      listaJogadoresEl.appendChild(div);
    });
    
    // Exibir contador de jogadores
    const contador = document.createElement("div");
    contador.className = "text-center p-2 text-xs text-indigo-600 font-semibold";
    contador.innerHTML = `<i class="fas fa-users mr-1"></i> ${jogadores.length} jogador(es) (mínimo 4, necessário número par)`;
    listaJogadoresEl.appendChild(contador);
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
     DICAS E NOTIFICAÇÕES EXTRAS
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  // Adicionar dicas para os campos
  campoDica.addEventListener('focus', () => {
    mostrarMensagem('Digite uma dica para ajudar seu parceiro a adivinhar a palavra!', 'info');
  });
  
  campoChute.addEventListener('focus', () => {
    mostrarMensagem('Digite seu chute para a palavra secreta!', 'info');
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     INICIA NA TELA CONFIG
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  exibirTelaConfig();
  ajustarLayoutParaTelaPequena();
  renderJogadores();
  
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

  // Mensagem de boas-vindas
  mostrarMensagem("Bem-vindo ao jogo Qual é a Palavra! Adicione jogadores para começar.", "info");
})();
