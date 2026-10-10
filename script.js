const nomesFases = {
    phase1: "UI & UX",
    phase2: "Front-end",
    phase3: "AmbComp",
    phase4: "Banco de Dados",
    phase5: "C#"
};
// Isso são os nomes q variam e tals

const configuracoes = {
    // Essas são as confgs de cada uma das linhas de svg e afins
    phase1: {
        linhas: 7,
        pontos: 170,
        frequencia: 4.2,
        frequencia2: 8,
        amplitude: 58,
        amplitude2: 16,
        espalhamento: 260,
        queda: 1300,
        inclinacao: 100,
        suavidade: 1.2,
        microFrequencia: 31,
        microForca: .15
    },

    phase2: {
        linhas: 9,
        pontos: 180,
        frequencia: 8,
        frequencia2: 17,
        amplitude: 72,
        amplitude2: 28,
        espalhamento: 340,
        queda: 1380,
        inclinacao: 125,
        suavidade: 1,
        microFrequencia: 42,
        microForca: .3
    },

    phase3: {
        linhas: 8,
        pontos: 185,
        frequencia: 12,
        frequencia2: 24,
        amplitude: 48,
        amplitude2: 18,
        espalhamento: 300,
        queda: 1420,
        inclinacao: 150,
        suavidade: .7,
        microFrequencia: 55,
        microForca: .22
    },

    phase4: {
        linhas: 7,
        pontos: 170,
        frequencia: 5,
        frequencia2: 10,
        amplitude: 95,
        amplitude2: 22,
        espalhamento: 380,
        queda: 1480,
        inclinacao: 175,
        suavidade: 1.3,
        microFrequencia: 31,
        microForca: .08
    },

    phase5: {
        linhas: 8,
        pontos: 185,
        frequencia: 7,
        frequencia2: 15,
        amplitude: 115,
        amplitude2: 38,
        espalhamento: 450,
        queda: 1550,
        inclinacao: 210,
        suavidade: .8,
        microFrequencia: 37,
        microForca: .45
    }
};

const paletas = {
    phase1: {
        fundo: "#0f0818",
        principal: "#8e44ad",
        secundaria: "#54246f",
        destaque: "#c26cff"
    },

    phase2: {
        fundo: "#241507",
        principal: "#e89b20",
        secundaria: "#9b5b0c",
        destaque: "#ffd21c"
    },

    phase3: {
        fundo: "#07151c",
        principal: "#247ba0",
        secundaria: "#153e52",
        destaque: "#5ecbff"
    },

    phase4: {
        fundo: "#07170e",
        principal: "#3e9148",
        secundaria: "#236332",
        destaque: "#8adf67"
    },

    phase5: {
        fundo: "#1c0905",
        principal: "#d94b27",
        secundaria: "#8b2818",
        destaque: "#ff795c"
    }
};
// Aqui ficam as cores de cada área, pra n precisar espalhar elas pelo código inteiro.

const svgNS = "http://www.w3.org/2000/svg";
// Mais essa chatisse de SVG

const textoDinamico =
    document.querySelector("#letreiro");
// essa parte é legal, é o meu texto q fica mudando quando vc muda de fase

const fases =
    document.querySelectorAll(
        'input[name="phase"]'
    );

const containerBase =
    document.querySelector("#bg-base");

const containerGlow =
    document.querySelector("#bg-glow");

const site =
    document.querySelector(".site");

const disco =
    document.querySelector(".disco");

const paineis =
    document.querySelectorAll(".painel-faixa");

const areas =
    document.querySelectorAll(".area");

const bolinhas =
    document.querySelectorAll(".bolinha");

let intervaloScramble = null;

let mouseFrame = null;

let mouseAtivo = false;

let mouseX = -1000;
let mouseY = -1000;
// descobri q é assim q se acha X e Y e dps configurei pro lugar onde queria q ele fosse usado


function obterFaseAtiva() {

    return (
        document.querySelector(
            'input[name="phase"]:checked'
        )?.id || "phase1"
    );
}


// Essa parte pega um caractere aleatório pra animação do texto.
function obterCaractereAleatorio() {

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    // Achei meio engraçado o resultado final mas isso aqui é as possiveis variações de palavras

    return caracteres[
        Math.floor(
            Math.random() * caracteres.length
        )
    ];
}


function embaralharTexto(elemento, texto) {

    if (!elemento) {
        return;
    }

    if (intervaloScramble !== null) {
        clearInterval(intervaloScramble);
        intervaloScramble = null;
    }

    const fragment =
        document.createDocumentFragment();

    const spans = [];

    for (
        let i = 0;
        i < texto.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.className = "letra";

        span.textContent =
            texto[i] === " "
                ? "\u00A0"
                : obterCaractereAleatorio();

        spans.push(span);

        fragment.appendChild(span);
    }

    elemento.replaceChildren(fragment);
    // Isso eu ainda n entendi direito, foi mal mas peguei essa linha com IA
    // Pelo q entendi, isso troca o conteúdo antigo pelo novo q eu montei ali em cima.

    let contador = 0;
    // fiquei com preguiça agora ent vou parar de comentar, dcp Susu kkkkk

    intervaloScramble = setInterval(() => {

        for (
            let i = 0;
            i < spans.length;
            i++
        ) {

            const span = spans[i];
            const caractere = texto[i];

            if (caractere === " ") {

                span.textContent = "\u00A0";

                span.className = "letra";

                continue;
            }

            if (i < contador) {

                span.textContent = caractere;

                span.className = "letra";

            } else {

                span.textContent =
                    obterCaractereAleatorio();

                span.className =
                    "letra embaralhando";
            }
        }

        contador++;

        if (contador > texto.length) {

            clearInterval(intervaloScramble);

            intervaloScramble = null;

            for (
                let i = 0;
                i < spans.length;
                i++
            ) {

                spans[i].textContent =
                    texto[i] === " "
                        ? "\u00A0"
                        : texto[i];

                spans[i].className = "letra";
            }
        }

    }, 45);
}


function atualizarTexto(fase) {

    if (!textoDinamico) {
        return;
    }

    const texto = nomesFases[fase];

    if (!texto) {
        return;
    }

    embaralharTexto(
        textoDinamico,
        texto
    );
}


// Essa função troca as cores dependendo da área selecionada.
function atualizarPaleta(fase) {

    if (!site) {
        return;
    }

    const cores =
        paletas[fase] || paletas.phase1;

    site.style.setProperty(
        "--fundo",
        cores.fundo
    );

    site.style.setProperty(
        "--cor-principal",
        cores.principal
    );

    site.style.setProperty(
        "--cor-secundaria",
        cores.secundaria
    );

    site.style.setProperty(
        "--cor-destaque",
        cores.destaque
    );
}


// Aqui começa a parte q calcula o formato das ondas.
function calcularOnda(
    t,
    linha,
    centro,
    config,
    fase
) {

    const crescimento =
        Math.pow(
            t,
            config.suavidade
        );

    const distanciaCentro =
        centro *
        config.espalhamento *
        (
            .38 +
            crescimento * 1.15
        );

    const faseOnda =
        linha * .85 +
        (
            fase === "phase5"
                ? linha * .3
                : 0
        );

    const ondaPrincipal =
        Math.sin(
            t *
            Math.PI *
            config.frequencia +
            faseOnda
        );

    let ondaSecundaria =
        Math.sin(
            t *
            Math.PI *
            config.frequencia2 -
            linha * .45
        );

    let ondaMicro =
        Math.sin(
            t *
            Math.PI *
            config.microFrequencia +
            linha
        );

    if (fase === "phase1") {

        ondaSecundaria =
            Math.sin(
                t *
                Math.PI *
                8 +
                faseOnda * .4
            );

    } else if (fase === "phase2") {

        ondaSecundaria =
            Math.sin(
                t *
                Math.PI *
                17 -
                faseOnda
            );

    } else if (fase === "phase3") {

        ondaSecundaria =
            Math.sin(
                t *
                Math.PI *
                24 -
                linha
            );

        ondaMicro =
            Math.sin(
                t *
                Math.PI *
                55 +
                linha * 2
            );

    } else if (fase === "phase4") {

        ondaSecundaria =
            Math.sin(
                t *
                Math.PI *
                10 +
                faseOnda * .5
            );

    } else if (fase === "phase5") {

        ondaSecundaria =
            Math.sin(
                t *
                Math.PI *
                15 -
                linha * .8
            );

        ondaMicro =
            Math.sin(
                t *
                Math.PI *
                37 +
                linha * 1.7
            );
    }

    ondaMicro *= config.microForca;

    let energia = 1;

    if (fase === "phase2") {

        energia =
            .7 +
            Math.pow(
                Math.sin(
                    t *
                    Math.PI *
                    4
                ),
                8
            ) * 1.5;

    } else if (fase === "phase3") {

        energia =
            .8 +
            Math.abs(
                Math.sin(
                    t *
                    Math.PI *
                    9
                )
            ) * .7;

    } else if (fase === "phase5") {

        energia =
            .75 +
            Math.pow(
                Math.abs(
                    Math.sin(
                        t *
                        Math.PI *
                        6
                    )
                ),
                5
            ) * 1.6;
    }

    const amplitude =
        config.amplitude *
        (
            .12 +
            crescimento * 1.05
        );

    const amplitudeSecundaria =
        config.amplitude2 *
        crescimento;

    const onda =
        ondaPrincipal *
        amplitude *
        energia;

    const onda2 =
        ondaSecundaria *
        amplitudeSecundaria;

    const micro =
        ondaMicro *
        config.amplitude *
        .08;

    const queda =
        Math.pow(
            t,
            1.18
        ) *
        config.queda;

    const inclinacao =
        centro *
        t *
        config.inclinacao;

    const curva =
        Math.sin(
            t *
            Math.PI *
            1.4 +
            linha
        ) *
        t *
        55;

    return (
        355 +
        queda +
        distanciaCentro +
        onda +
        onda2 +
        micro +
        inclinacao +
        curva
    );
}


// Essa função desenha uma linha de cada vez.
function criarPath(
    config,
    linha,
    fase
) {

    const path =
        document.createElementNS(
            svgNS,
            "path"
        );

    const nivel =
        config.linhas === 1
            ? 0
            : linha /
            (config.linhas - 1);

    const centro = nivel - .5;

    const pontos =
        new Array(
            config.pontos + 1
        );

    for (
        let ponto = 0;
        ponto <= config.pontos;
        ponto++
    ) {

        const t =
            ponto / config.pontos;

        const x =
            1510 -
            t * 1880;

        const y =
            calcularOnda(
                t,
                linha,
                centro,
                config,
                fase
            );

        pontos[ponto] =
            ponto === 0
                ? `M${x.toFixed(1)} ${y.toFixed(1)}`
                : `L${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    path.setAttribute(
        "d",
        pontos.join(" ")
    );

    path.setAttribute(
        "fill",
        "none"
    );

    path.setAttribute(
        "stroke-width",
        linha === Math.floor(config.linhas / 2)
            ? "2.8"
            : "1.6"
    );

    return path;
}


// Aqui junta as linhas e cria o SVG de cada área.
function criarSVG(fase) {

    const config =
        configuracoes[fase] ||
        configuracoes.phase1;

    const svg =
        document.createElementNS(
            svgNS,
            "svg"
        );

    const fragment =
        document.createDocumentFragment();

    svg.setAttribute(
        "viewBox",
        "0 0 1920 2100"
    );

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );

    for (
        let linha = 0;
        linha < config.linhas;
        linha++
    ) {

        fragment.appendChild(
            criarPath(
                config,
                linha,
                fase
            )
        );
    }

    svg.appendChild(fragment);

    return svg;
}


// Coloca as ondas nas duas camadas do fundo.
function gerarLinhasMusicais(fase = obterFaseAtiva()) {

    if (
        !containerBase ||
        !containerGlow
    ) {
        return;
    }

    const svg =
        criarSVG(fase);

    const svgGlow =
        svg.cloneNode(true);

    containerBase.replaceChildren(svg);

    containerGlow.replaceChildren(svgGlow);
}


// Atualiza o lugar onde o brilho do mouse aparece.
function atualizarMouse() {

    mouseFrame = null;

    if (!containerGlow || !site) {
        return;
    }

    if (!mouseAtivo) {

        containerGlow.style.setProperty(
            "--luz-x",
            "-1000px"
        );

        containerGlow.style.setProperty(
            "--luz-y",
            "-1000px"
        );

        return;
    }

    const rect =
        site.getBoundingClientRect();

    const x =
        mouseX -
        rect.left;

    const y =
        mouseY -
        rect.top;

    containerGlow.style.setProperty(
        "--luz-x",
        `${x}px`
    );

    containerGlow.style.setProperty(
        "--luz-y",
        `${y}px`
    );
}


// Isso evita ficar atualizando o brilho mais vezes do q precisa.
function agendarAtualizacaoMouse() {

    if (mouseFrame !== null) {
        return;
    }

    mouseFrame =
        requestAnimationFrame(
            atualizarMouse
        );
}


if (
    site &&
    containerGlow
) {

    site.addEventListener(
        "pointermove",
        evento => {

            mouseAtivo = true;

            mouseX = evento.clientX;
            mouseY = evento.clientY;

            agendarAtualizacaoMouse();

        },
        {
            passive: true
        }
    );

    site.addEventListener(
        "pointerleave",
        () => {

            mouseAtivo = false;

            agendarAtualizacaoMouse();

        }
    );

    window.addEventListener(
        "scroll",
        () => {

            if (mouseAtivo) {
                agendarAtualizacaoMouse();
            }

        },
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        () => {

            if (mouseAtivo) {
                agendarAtualizacaoMouse();
            }

        },
        {
            passive: true
        }
    );
}


// Essa parte atualiza o painel, as áreas e as bolinhas.
function atualizarPainel(fase) {

    const numero =
        Number(
            fase.replace("phase", "")
        );

    paineis.forEach(painel => {

        painel.style.display =
            painel.classList.contains(
                `painel-${numero}`
            )
                ? "block"
                : "none";

    });

    areas.forEach(area => {

        area.style.display =
            area.classList.contains(
                `area-${numero}`
            )
                ? "block"
                : "none";

    });

    bolinhas.forEach((bolinha, indice) => {

        const ativa =
            indice === numero - 1;

        bolinha.style.background =
            ativa
                ? "var(--cor-destaque)"
                : "";

        bolinha.style.transform =
            ativa
                ? "scale(1.5)"
                : "";

        bolinha.setAttribute(
            "aria-current",
            ativa ? "true" : "false"
        );

    });

    // Cada área gira o disco mais 72 graus.
    if (disco) {

        disco.style.transform =
            `rotate(${(numero - 1) * 72}deg)`;

    }
}


// Aqui junta todas as coisas q precisam mudar quando troca de fase.
function atualizarInterface(fase) {

    if (!configuracoes[fase]) {
        return;
    }

    atualizarPaleta(fase);

    atualizarTexto(fase);

    atualizarPainel(fase);

    gerarLinhasMusicais(fase);
}


// Quando clico numa das faixas, tudo é atualizado.
fases.forEach(fase => {

    fase.addEventListener(
        "change",
        () => {

            if (fase.checked) {

                atualizarInterface(
                    fase.id
                );

            }

        }
    );

});


// Faz tudo começar funcionando na primeira faixa.
atualizarInterface(
    obterFaseAtiva()
);
