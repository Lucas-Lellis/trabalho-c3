// Array de pelo menos 10 cores nomeadas do HTML
const COLORS = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 
    'pink', 'brown', 'gray', 'cyan', 'lime', 'gold'
];

// Variáveis do DOM
const body = document.body;
const inputCor = document.getElementById('input-cor');
const btnAdivinhar = document.getElementById('btn-adivinhar');
const btnReset = document.getElementById('btn-reset');
const feedbackMensagem = document.getElementById('feedback-mensagem');
const tentativasRestantesSpan = document.getElementById('tentativas-restantes');

// Variáveis de estado do jogo
let corSorteada = '';
let tentativas = 0; // Variável para armazenar o número de tentativas restantes
const MAX_TENTATIVAS = 3;

/**
 * Sorteia uma cor aleatória do array de cores.
 * @returns {string} A cor sorteada.
 */
function sortearCor() {
    // Math.random() e Math.floor() para sortear um índice aleatório
    const indiceAleatorio = Math.floor(Math.random() * COLORS.length);
    return COLORS[indiceAleatorio];
}

/**
 * Inicia ou reinicia o jogo, resetando as variáveis de estado e a interface.
 */
function iniciarJogo() {
    tentativas = MAX_TENTATIVAS; // Define o número de tentativas
    corSorteada = sortearCor(); // Sorteia uma nova cor

    // Resetar o DOM
    tentativasRestantesSpan.textContent = tentativas;
    feedbackMensagem.textContent = 'Adivinhe a cor!';
    feedbackMensagem.className = 'feedback-info';
    inputCor.value = '';
    
    // Habilitar/Desabilitar botões
    btnAdivinhar.disabled = false;
    inputCor.disabled = false;
    btnReset.classList.add('hidden'); // Botão "Jogar Novamente" (inicialmente oculto)
    
    // Resetar cor de fundo para a cor inicial
    body.style.backgroundColor = 'var(--bg-start)';

    // Apenas para debug:
    // console.log('Cor Sorteada:', corSorteada); 
}

/**
 * Exibe a mensagem de feedback e aplica o estilo correto.
 * @param {string} mensagem - O texto da mensagem.
 * @param {string} tipo - 'info', 'success' ou 'error'.
 */
function exibirFeedback(mensagem, tipo) {
    feedbackMensagem.textContent = mensagem;
    feedbackMensagem.className = `feedback-${tipo}`;
}

/**
 * Finaliza o jogo (por acerto ou por esgotar tentativas).
 * @param {boolean} acertou - Indica se o jogo terminou por acerto.
 */
function finalizarJogo(acertou) {
    btnAdivinhar.disabled = true; // Desabilita o botão "Adivinhar"
    inputCor.disabled = true;
    btnReset.classList.remove('hidden'); // Exibe o botão "Jogar Novamente"
    
    if (acertou) {
        // Mudar cor de fundo para a cor sorteada
        body.style.backgroundColor = corSorteada;
        exibirFeedback(`🎉 Parabéns! Você acertou a cor (${corSorteada})!`, 'success'); // Mensagem de parabéns
    } else {
        // Mensagem de fim de jogo e revela a cor
        exibirFeedback(`Fim de Jogo! As tentativas acabaram. A cor correta era: ${corSorteada}`, 'error');
    }
}

/**
 * Lida com a submissão da tentativa do jogador.
 */
function checarTentativa() {
    if (tentativas === 0) return;

    const palpite = inputCor.value.trim();
    
    // Validação de entrada: Verificar se o campo não está vazio
    if (palpite === '') {
        exibirFeedback('Por favor, digite o nome de uma cor antes de adivinhar!', 'info');
        return;
    }

    // Converter para lowercase para comparação (case-insensitive)
    const palpiteLowerCase = palpite.toLowerCase();
    
    // Comparação: Palpite correto
    if (palpiteLowerCase === corSorteada) {
        finalizarJogo(true);
        return;
    }
    
    // Palpite incorreto
    tentativas--; // Decrementar o contador de tentativas
    tentativasRestantesSpan.textContent = tentativas;

    // Limpar campo de texto para nova tentativa
    inputCor.value = '';

    if (tentativas > 0) {
        // Exibir mensagem de erro
        exibirFeedback(`Errado! Tente novamente. Tentativas restantes: ${tentativas}`, 'error');
    } else {
        // Fim de jogo por erro
        finalizarJogo(false);
    }
}

// ----------------------------------------------------
// Event Listeners
// ----------------------------------------------------

// Evento no botão "Adivinhar" para submeter a resposta
btnAdivinhar.addEventListener('click', checarTentativa);

// Evento para reiniciar o jogo
btnReset.addEventListener('click', iniciarJogo);

// Permite submeter com a tecla Enter
inputCor.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !btnAdivinhar.disabled) {
        checarTentativa();
    }
});

// Inicia o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', iniciarJogo);