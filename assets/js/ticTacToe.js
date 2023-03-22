const imgCircle = './assets/img/circle.png';
const imgX = './assets/img/x.png';
const boxes = document.querySelectorAll('td');
const textPlay = document.querySelectorAll('.textPlay');
const winPopUp = document.querySelector('.popUp__win');
const losePopUp = document.querySelector('.popUp__lose');
const tiePopUp = document.querySelector('.popUp__tie');
const reset = document.querySelectorAll('.reset');
let isMachineTurn = false;
const results = new Array(9).fill('');
const winPatterns = [
  [0, 1, 2], // row 1
  [3, 4, 5], // row 2
  [6, 7, 8], // row 3
  [0, 3, 6], // column 1
  [1, 4, 7], // column 2
  [2, 5, 8], // column 3
  [0, 4, 8], // diagonal \
  [2, 4, 6], // diagonal /
];

function whoseTurnIsIt() {
  isMachineTurn = isMachineTurn ? false : true;
}

function theElementHasChildren(box) {
  return box.hasChildNodes();
}

function randomNumberGenerator() {
  return Math.floor(Math.random()*9);
}


function changeText(player) {
  let index = (player > 0) ? 0: 1;
  textPlay[player].classList.add('hidden');
  textPlay[index].classList.remove('hidden');
}

function checkTie() {
  let filledBox =true;
  for (const element of results) {
    if (element === '') filledBox=false
  }
  return filledBox;
}

function checkVictory(player) {
  for (const element of winPatterns) {
    const [a,b,c] = element;
    if (results[a] === player && results[b] === player && results[c] === player) {
      return true;
    }
  }
  return false;
}

function popUp(player) {
  boxes.forEach((item) => {
    item.disable = true;
  })
  if (player === 0) {
    winPopUp.classList.remove('hidden');
    losePopUp.classList.add('hidden');
    tiePopUp.classList.add('hidden');
  } else if (player === 1) {
    winPopUp.classList.add('hidden');
    losePopUp.classList.remove('hidden');
    tiePopUp.classList.add('hidden');
  } else {
    winPopUp.classList.add('hidden');
    losePopUp.classList.add('hidden');
    tiePopUp.classList.remove('hidden');
  }
}

function activateOnClickComputer() {
  let index = jogadaPC(results);
  let box = boxes[index];
  const icon = document.createElement('img');
  box.appendChild(icon);
  icon.src = imgX;
  icon.classList.add('icon');
  results[index] = 1;
  whoseTurnIsIt();
  changeText(1);
  if (checkVictory(1)) popUp(1);
  if (checkTie()) popUp();
}

function activateOnClickHuman(box, player,index) {
  if (theElementHasChildren(box)) return
  if (isMachineTurn) return
  const icon = document.createElement('img');
  box.appendChild(icon);
  icon.src = imgCircle;
  icon.classList.add('icon');
  results[index] = player;
  whoseTurnIsIt();
  changeText(player);
  if (checkVictory(player)) {
    popUp(0);
    return;
  }
  if (checkTie()) {
    popUp();
    return;
  }
  setTimeout(activateOnClickComputer,1000);
}

function init() {
  boxes.forEach((box, i) => {
    box.addEventListener('click', () => {
      activateOnClickHuman(box,0,i);
    })
  })
  reset.forEach((item) => {
    item.addEventListener('click', () => {
      location.reload();
    })
  })
}

init()



function jogadaPC(tabuleiro) {
  // Verifique se o PC pode vencer na próxima jogada
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '' && winningMove(tabuleiro, i, 1)) {
      return i;
    }
  }
  
  // Verifique se o jogador pode vencer na próxima jogada e bloqueie-o
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '' && winningMove(tabuleiro, i, 0)) {
      return i;
    }
  }
  
  // Bloqueia uma jogada do jogador, se possível
  const posicaoBloqueada = defensivePlay(tabuleiro, 0);
  if (posicaoBloqueada !== -1) {
    return posicaoBloqueada;
  }
  
  // Escolha uma posição aleatória
  const posicoesVazias = [];
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '') {
      posicoesVazias.push(i);
    }
  }
  return posicoesVazias[Math.floor(Math.random() * posicoesVazias.length)];
}

function defensivePlay(tabuleiro, jogador) {
  // Percorre todas as posições do tabuleiro
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === '') {
      // Simula a jogada do jogador na posição i
      tabuleiro[i] = jogador === 0 ? 0 : 1;
      
      // Verifica se a jogada do jogador resultaria em vitória
      if (winningMove(tabuleiro, i, jogador === 0 ? 0 : 1)) {
        // Se sim, desfaz a jogada do jogador e retorna a posição bloqueada
        tabuleiro[i] = '';
        return i;
      }
      
      // Desfaz a jogada do jogador para continuar a iteração
      tabuleiro[i] = '';
    }
  }
  
  // Se nenhuma jogada do jogador resultaria em vitória, retorna -1
  return -1;
}

function winningMove(tabuleiro, posicao, jogador) {
  const adversario = jogador === 1 ? 0 : 1;

  // Verifique a linha
  const linha = Math.floor(posicao / 3) * 3;
  if (tabuleiro[linha] === jogador && tabuleiro[linha + 1] === jogador && tabuleiro[linha + 2] === jogador) {
    return true;
  }
  if (tabuleiro[linha] === adversario && tabuleiro[linha + 1] === adversario && tabuleiro[linha + 2] === adversario) {
    return false;
  }

  // Verifique a coluna
  const coluna = posicao % 3;
  if (tabuleiro[coluna] === jogador && tabuleiro[coluna + 3] === jogador && tabuleiro[coluna + 6] === jogador) {
    return true;
  }
  if (tabuleiro[coluna] === adversario && tabuleiro[coluna + 3] === adversario && tabuleiro[coluna + 6] === adversario) {
    return false;
  }

  // Verifique as diagonais
  if (posicao % 2 === 0) {
    if (tabuleiro[0] === jogador && tabuleiro[4] === jogador && tabuleiro[8] === jogador) {
      return true;
    }
    if (tabuleiro[0] === adversario && tabuleiro[4] === adversario && tabuleiro[8] === adversario) {
      return false;
    }
    if (tabuleiro[2] === jogador && tabuleiro[4] === jogador && tabuleiro[6] === jogador) {
      return true;
    }
    if (tabuleiro[2] === adversario && tabuleiro[4] === adversario && tabuleiro[6] === adversario) {
      return false;
    }
  }

  return false;
}