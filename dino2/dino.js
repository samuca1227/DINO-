//board /A área de jogo onde tudo será desenhado.
let board;
let boardWidth = 750; //- Define a largura da área de jogo em 750 pixels.
let boardHeight = 250; //- Define a altura da área de jogo em 250 pixels.
let context; //- Declara a variável context, que será usada para desenhar elementos no Canvas.

//dino / O personagem principal do jogo, que pode saltar para evitar obstáculos.
let dinoWidth = 88; //- Largura do dinossauro em 88 pixels.
let dinoHeight = 94; //- Altura do dinossauro em 94 pixels.
let dinoX = 50; //- Posição horizontal inicial do dinossauro, localizada 50 pixels à direita da borda esquerda do canvas.
let dinoY = boardHeight - dinoHeight; //- Define a posição vertical inicial do dinossauro, garantindo que ele fique no chão (boardHeight - dinoHeight).
let dinoImg; //Declaração da variável que armazenará a imagem do dinossauro.

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus /Obstáculos gerados aleatoriamente que se movem para a esquerda.
let cactusArray = []; //- Um array vazio é criado para armazenar os cactos que vão aparecer na tela.

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70; //- Todos tem a mesma altura de 70 pixels.
let cactusX = 700; //- Os cactos começam na posição horizontal 700, longe do dinossauro.
let cactusY = boardHeight - cactusHeight; //- A posição vertical (cactusY) é calculada para que os cactos fiquem no chão do jogo (boardHeight - cactusHeight).

let cactus1Img;
let cactus2Img; //Declaramos as variáveis que irão armazenar as imagens dos três tipos de cactos.
let cactus3Img;

//physics
let velocityX = -8; //- Define a velocidade horizontal dos cactos. Como o valor é -8, eles se deslocam para a esquerda.
let velocityY = 0; //- é a velocidade vertical do dinossauro, usada no salto.
let gravity = .4; //- adiciona um efeito de gravidade, puxando o dinossauro para o chão depois do salto.

let gameOver = false; //- indica que o jogo ainda não acabou.
let score = 0; //-  inicia a pontuação em 0.

window.onload = function() {
    board = document.getElementById("board"); //- Esse trecho executa quando a página é carregada, Isso garante que a área do jogo esteja pronta para receber os elementos gráficos
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //usado para desenhar no quadro

    //desenhe o dinossauro inicial
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image(); //- Cria um novo objeto Image, que será usado para armazenar a imagem do dinossauro.
    dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino.png?raw=true&quot"; //Define o caminho da imagem que será carregada.
    dinoImg.onload = function() { //- A função onload garante que a imagem do dinossauro seja desenhada na tela após ser carregada.
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } //- A função drawImage() desenha o dinossauro nas coordenadas dino.x e dino.y, com as dimensões dino.width e dino.height.

    cactus1Img = new Image();
    cactus1Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus1.png?raw=true&quot";

    cactus2Img = new Image();
    cactus2Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus2.png?raw=true&quot"; //Essas linhas do código carregam as imagens do dinossauro e dos cactos para que possam ser desenhadas no jogo.

    cactus3Img = new Image();
    cactus3Img.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/big-cactus3.png?raw=true&quot;"

    requestAnimationFrame(update); //- Início do loop de atualização

    setInterval(placeCactus, 1000); //Configuração de um intervalo para adicionar cactos
    document.addEventListener("keydown", moveDino); //Adição do evento de teclado
}

function update() { //Chamado repetidamente para manter o jogo em funcionamento
    requestAnimationFrame(update); //- Essa função chama a próxima atualização do jogo, garantindo que ele seja redesenhado constantemente.
    if (gameOver) { //- Se gameOver for true, o jogo para e não continua atualizando os elementos.
        return;
    }
    context.clearRect(0, 0, board.width, board.height); //- Antes de desenhar a nova posição dos elementos, o código apaga o conteúdo anterior do Canvas.

    //dino
    velocityY += gravity; //- A variável velocityY controla a velocidade vertical do dinossauro.
    dino.y = Math.min(dino.y + velocityY, dinoY); //aplica gravidade ao dino.y atual, certificando-se de que não exceda o solo
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); //- A imagem do dinossauro (dinoImg) é desenhada na nova posição dino.y.

    //cactus
    for (let i = 0; i < cactusArray.length; i++) { //- Percorre todos os cactos armazenados no array cactusArray.
        let cactus = cactusArray[i];
        cactus.x += velocityX; //- A posição x do cacto é diminuída (velocityX = -8), movendo-o para a esquerda.
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height); //- Usa context.drawImage() para desenhar cada cacto na sua nova posição.

        if (detectCollision(dino, cactus)) { //- A função detectCollision(dino, cactus) verifica se o dinossauro bateu em um cacto.
            gameOver = true; //- Se houver colisão, o jogo é encerrado (gameOver = true).
            dinoImg.src = "https://github.com/ImKennyYip/chrome-dinosaur-game/blob/master/img/dino-dead.png?raw=true&quot";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle="black"; //- Define a cor do texto como preto, garantindo visibilidade no fundo do jogo.
    context.font="20px courier"; //- Define a fonte usada para exibir a pontuação
    score++; //- A pontuação (score) é incrementada em 1 a cada atualização do jogo.
    context.fillText(score, 5, 20); //- Exibe o valor atual da pontuação no Canvas.
}

function moveDino(e) { //Essa função é chamada quando uma tecla é pressionada e controla os movimentos do dinossauro.
    if (gameOver) { //- Se o jogo já acabou (gameOver == true), a função retorna sem executar nada.

        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) { //- Se a tecla pressionada for espaço ("Space") ou seta para cima ("ArrowUp"), o dinossauro pula.

        //jump
        velocityY = -10; //- O efeito de salto ocorre porque velocityY recebe -10, fazendo o dinossauro se mover para cima.
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null, //começa com null pois nenhuma imagem foi definida.
        x : cactusX, //- x = cactusX posiciona o cacto na extremidade direita da tela (700 pixels).
        y : cactusY, //- y = cactusY garante que o cacto fique no chão (boardHeight - cactusHeight).
        width : null, //também começa como null pois será definida depois.
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999... //- Math.random() gera um número decimal aleatório entre 0 e 0.9999....

    if (placeCactusChance > .90) { //10% de gerar cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% de gerar cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% de gerar cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus); //- Depois que o tipo de cacto é escolhido, ele é adicionado ao array cactusArray.
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remova o primeiro elemento da matriz para que ela não cresça constantemente
    }
}

function detectCollision(a, b) { //Define se o dinossauro bateu em um cacto, analisando as coordenadas dos elementos.
    return a.x < b.x + b.width &&   //a's - O canto esquerdo do dinossauro (a.x) está antes do canto direito do cacto (b.x + b.width).
           a.x + a.width > b.x &&   //a's - O canto direito do dinossauro (a.x + a.width) passou do canto esquerdo do cacto (b.x).
           a.y < b.y + b.height &&  //a's - - O canto superior do dinossauro (a.y) está acima do canto inferior do cacto (b.y + b.height).
           a.y + a.height > b.y;
    }    //a's - O canto inferior do dinossauro (a.y + a.height) passou do canto superior do cacto (b.y).
