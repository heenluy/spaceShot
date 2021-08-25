// Variáveis para controlar o jogador
let playerY, playerX, playerPositionX, playerPositionY, thePlayer, playerVelocity;

// Variáveis para controlar o jogo em si
let jogo, frames, velTiro, life, lifeQuant, janelaModal;

// Variáveis para o gerenciamento das bombas
let bombasQuant, bombasResul, bombas, bombaVel, bombaInterval;

// Variáveis para o controle de explosões
let contExplosao, contSom;

// Variáveis do Display
let horizontalScreen, verticalScreen;

const pressionadas = () => {
    let keyEvent = event.keyCode;

    if (keyEvent == 38) {
        // Para Cima
        playerY = -1;
    
    } else if (keyEvent == 40) {
        // Para Baixo
        playerY = 1;
    
    } else if (keyEvent == 37) {
        // Esquerda
        playerX = -1;
    
    } else if (keyEvent == 39) {
        // Direita
        playerX = 1;
    
    } else if (keyEvent == 32) {
        // tiro
        disparo(playerPositionX + 17, playerPositionY);
    };

}

const soltas = () => {
    let keyEvent = event.keyCode;

    if ((keyEvent == 38) || (keyEvent == 40)) {
        // Para Cima
        playerY = 0;
    
    } else if ((keyEvent == 37) || (keyEvent == 39)) {
        // Esquerda
        playerX = 0;
    };
}

// Função que controla o jogador
const playerController = () => {
    //alert('o controller está ligado!');

    playerPositionY += playerY * playerVelocity;
    playerPositionX += playerX * playerVelocity;
    thePlayer.style.top = playerPositionY + "px";
    thePlayer.style.left = playerPositionX + "px";
    
}

// Função que cria as bombas aleatoriamente
const criarBombas = () => {
    if (jogo) {
    
        let y = 0;
        let x = Math.random() * horizontalScreen;

        let bomba = document.createElement('div');
        let att1 = document.createAttribute('class');
        let att2 = document.createAttribute('style');

        att1.value = 'bomba';
        att2.value = 'top:' + y + 'px; left:' + x + 'px';
        bomba.setAttributeNode(att1);
        bomba.setAttributeNode(att2);

        document.body.appendChild(bomba);
        bombasQuant--;
    };

}

// Função que gerencia as bombas
const controlaBombas = () => {
    bombas = document.getElementsByClassName('bomba');
    let tamanhoBombas = bombas.length;

    for (let i = 0; i < tamanhoBombas; i++) {
        if (bombas[i]) {
            let bombaPos = bombas[i].offsetTop;
            bombaPos += bombaVel;

            bombas[i].style.top = bombaPos + 'px';

            if(bombaPos > verticalScreen) {
                life -= 30;
                geraExplosao(2, bombas[i].offsetLeft, null);
                bombas[i].remove();
            }
        }
    }
} 

// Função de criar o disparo estático
const disparo = (x, y) => {
    let tiro = document.createElement('div');
    let att1 = document.createAttribute('class');
    let att2 = document.createAttribute('style');
    att1.value = 'playerShot';
    att2.value = 'top:' + y + 'px; left:' + x + 'px';
    tiro.setAttributeNode(att1);
    tiro.setAttributeNode(att2);
    document.body.appendChild(tiro);
    //console.warn(x, y);
}

//Controla a direção do disparo
const controleTiro = () => {
    let tiros = document.getElementsByClassName('playerShot');
    let tirosQuant = tiros.length;

    for(let cont = 0; cont < tirosQuant; cont++) {
        if(tiros[cont]) {
            let tiroPos = tiros[cont].offsetTop;
            tiroPos -= velTiro;
            tiros[cont].style.top = tiroPos + "px";

            primeiraColisao(tiros[cont]);

            if(tiroPos < 0) {
                tiros[cont].remove();
            }
        }
    }
}

// Primeira colisão entre os tiros e as bombas
const primeiraColisao = (tiro) => {
    let localBombas = document.getElementsByClassName('bomba');
    let localBombaQuant = localBombas.length;

    for(let i = 0; i < localBombaQuant; i++) {
        if(localBombas[i]) {
            if(
                (
                    (tiro.offsetTop <= (localBombas[i].offsetTop + 80)) &&
                    ((tiro.offsetTop + 6) >= (localBombas[i].offsetTop))
                )
                &&
                (
                    (tiro.offsetLeft <= (localBombas[i].offsetLeft + 48)) &&
                    ((tiro.offsetLeft + 6) >= (localBombas[i].offsetLeft))
                )
            ) {
                geraExplosao(1, localBombas[i].offsetLeft - 25, localBombas[i].offsetTop);
                localBombas[i].remove();
                tiro.remove();
            
            }
        }
    }
}

//Função que gerencia as explosões nas colisões
const geraExplosao = (tipo, x, y) => {

    let explosaoId = document.getElementById('explosao' + (contExplosao - 4));

    if (explosaoId) {
        explosaoId.remove();
    }

    let divExplosao = document.createElement('div');
    let imagem = document.createElement('img');
    let audio = document.createElement('audio');

    // Atributos para divExplosão
    let att1 = document.createAttribute('class');
    let att2 = document.createAttribute('style');
    let att3 = document.createAttribute('id');

    // Alternância de IDS
    att3.value = 'explosao' + contExplosao;

    // Atributos para imagem
    let att4 = document.createAttribute('src');

    // Atributos para audio
    let att5 = document.createAttribute('src');
    let att6 = document.createAttribute('id');

    // Verificação do tipo de explosão
    if (tipo == 1) {
        att1.value = 'explosaoAr';
        att2.value = 'top:' + y + 'px; left:' + x + 'px;';
        att4.value = '/imagens/explosao_ar.gif?' + new Date;
    
    } else {
        att1.value = 'explosaoSolo';
        att2.value = 'top:' + (verticalScreen - 57) + 'px; left:' + (x - 17) + 'px;';
        att4.value = '/imagens/explosao_chao.gif?' + new Date;
    }

    // Gerenciando efeitos sonoros
    att5.value = '/sons/exp1.mp3';
    att6.value = 'somExplosao' + contSom;

    // Definindo todos os atributos nos elemntos
    divExplosao.setAttributeNode(att1);
    divExplosao.setAttributeNode(att2);
    divExplosao.setAttributeNode(att3);
    imagem.setAttributeNode(att4);
    audio.setAttributeNode(att5);
    audio.setAttributeNode(att6);

    //AppendChild
    divExplosao.appendChild(imagem);
    divExplosao.appendChild(audio);
    document.body.appendChild(divExplosao);

    //Play no Áudio
    document.getElementById('somExplosao' + contSom).play();

    // A cada execução, o id será incrementado
    contExplosao++;
    contSom++;
}

// Administração do jogo
const gameManager = () => {
    lifeQuant.style.width = life + 'px';

    let infoDinamica = document.getElementsByClassName('modal');
    let winLose = document.getElementById('winLose');
    let card = document.getElementById('card');
    let button = document.getElementById('play');
    
    // Caso o jogador vença!
    if (bombasQuant <= 0) {
        jogo = false;
        clearInterval(bombaInterval);
        janelaModal.style.display = 'flex';
        infoDinamica[0].style.display = 'none';
        infoDinamica[1].style.display = 'none';
        //infoDinamica[2].style.display = 'none';
        winLose.innerHTML = 'Parabéns,<br> Você Ganhou:)';
        winLose.style.fontSize = 2.6 + 'em';
        winLose.style.marginBottom = 18 + 'px';
        winLose.style.letterSpacing = 0 + 'px';
        card.style.backgroundColor = 'white';
        card.style.justifyContent = 'center';
        button.innerHTML = 'Reiniciar';

    } else if(life <= 0 ) {
        jogo = false;
        clearInterval(bombaInterval);
        janelaModal.style.display = 'flex';
        infoDinamica[0].style.display = 'none';
        infoDinamica[1].style.display = 'none';
        winLose.innerHTML = 'Sinto Muito,<br> Você Perdeu:(';
        winLose.style.fontSize = 2.6 + 'em';
        winLose.style.marginBottom = 18 + 'px';
        winLose.style.letterSpacing = 0 + 'px';
        card.style.backgroundColor = 'white';
        card.style.justifyContent = 'center';
        button.innerHTML = 'Reiniciar';
    }
}

// Game Loop principal do jogo
const gameLoop = () => {

    if (jogo) {
        /*Funções de controle*/ 
        playerController();
        controleTiro();
        controlaBombas();
    }
    gameManager();

    frames = requestAnimationFrame(gameLoop);
}

// Função que Reiniciar o Jogo
const reset = () => {

    let allBombas = document.getElementsByClassName('bomba');
    let tamanho = allBombas.length;

    for (let i = 0; i < tamanho; i++) {
        if (allBombas[i]) {
            allBombas[i].remove();
        }
    }

    //Desativando o Card
    janelaModal.style.display = 'none';

    // Animação do jogo
    clearInterval(bombaInterval);
    cancelAnimationFrame(frames);
    bombaInterval = setInterval(criarBombas, 1600);

    // Redefinindo as variáveis
    life = 300;
    bombasQuant = 150;
    playerPositionX = horizontalScreen / 2;
    playerPositionY = verticalScreen / 2;
    thePlayer.style.top = playerPositionY + "px";
    thePlayer.style.left = playerPositionX + "px";
    thePlayer.style.display = 'block';

    // Ligando o jogo
    jogo = true;

    // Ligando o Game Loop
    gameLoop();


}

// Onde as variáveis iniciais são carregadas/setadas
function inicia() {
    jogo = false;
    playerX = 0; 
    playerY = 0;
    verticalScreen = window.innerHeight;
    horizontalScreen = window.innerWidth;

    // Onde o jogador aparece
    playerPositionX = horizontalScreen / 2;
    playerPositionY = verticalScreen / 2;

    // velocidade da nave
    playerVelocity = 10;

    // velocidade do tiro
    velTiro = 10;

    // link do jogador
    thePlayer = document.getElementById('jogador');
    thePlayer.style.top = playerPositionY + "px";
    thePlayer.style.left = playerPositionX + "px";
    thePlayer.style.display = 'none';

    // Controle das Bombas
    bombasQuant = 150;
    bombaVel = 1.8;

    // Vida do 'planeta'
    life = 300;
    lifeQuant = document.getElementById('life');
    lifeQuant.style.width = life + 'px';

    // Gerenciamento de EXplosões
    contExplosao = 0;
    contSom = 0;

    // Janela(s) Modal
    janelaModal = document.getElementById('card');
    janelaModal.style.display = 'flex';
    document.getElementById('play').addEventListener('click', reset);
}

// Chamando os 'ouvintes'
window.addEventListener('load', inicia);
document.addEventListener('keydown', pressionadas);
document.addEventListener('keyup', soltas);