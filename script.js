const nomesFases = {
    phase1: "UI & UX",
    phase2: "Front-end",
    phase3: "AmbComp",
    phase4: "Banco de Dados",
    phase5: "C#"
};

const configuracoes = {
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

const svgNS = "http://www.w3.org/2000/svg";

const textoDinamico =
    document.querySelector("#texto-dinamico");

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

let intervaloScramble = null;

let mouseFrame = null;

let mouseX = -1000;
let mouseY = -1000;

function embaralharTexto(elemento, texto) {

    if (intervaloScramble) {
        clearInterval(intervaloScramble);
        intervaloScramble = null;
    }

    const fragment =
        document.createDocumentFragment();

    const spans = [];

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

    for (
        let i = 0;
        i < texto.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.className =
            "scramble-char";

        span.textContent =
            texto[i] === " "
                ? " "
                : caracteres[
                    Math.floor(
                        Math.random() *
                        caracteres.length
                    )
                ];

        spans.push(span);

        fragment.appendChild(span);
    }

    elemento.replaceChildren(fragment);

    let contador = 0;

    intervaloScramble = setInterval(() => {

        for (
            let i = 0;
            i < spans.length;
            i++
        ) {

            const span = spans[i];
            const caractere = texto[i];

            if (caractere === " ") {

                span.textContent = " ";
                span.className =
                    "scramble-char";

                continue;
            }

            if (i < contador) {

                span.textContent =
                    caractere;

                span.className =
                    "scramble-char done";

            } else {

                span.textContent =
                    caracteres[
                        Math.floor(
                            Math.random() *
                            caracteres.length
                        )
                    ];

                span.className =
                    "scramble-char scrambling";
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
                    texto[i];

                spans[i].className =
                    "scramble-char done";
            }
        }

    }, 45);
}

function atualizarTexto(fase) {

    if (!textoDinamico) {
        return;
    }

    const texto =
        nomesFases[fase];

    if (!texto) {
        return;
    }

    embaralharTexto(
        textoDinamico,
        texto
    );
}

function criarGradiente(svg) {

    const defs =
        document.createElementNS(
            svgNS,
            "defs"
        );

    const gradient =
        document.createElementNS(
            svgNS,
            "linearGradient"
        );

    gradient.id =
        "musicFade";

    gradient.setAttribute(
        "x1",
        "0"
    );

    gradient.setAttribute(
        "y1",
        "0"
    );

    gradient.setAttribute(
        "x2",
        "0"
    );

    gradient.setAttribute(
        "y2",
        "1"
    );

    const stops = [
        ["0%", "1"],
        ["18%", ".95"],
        ["38%", ".8"],
        ["58%", ".55"],
        ["75%", ".28"],
        ["90%", ".08"],
        ["100%", "0"]
    ];

    for (
        const [offset, opacity]
        of stops
    ) {

        const stop =
            document.createElementNS(
                svgNS,
                "stop"
            );

        stop.setAttribute(
            "offset",
            offset
        );

        stop.setAttribute(
            "stop-color",
            "var(--accent)"
        );

        stop.setAttribute(
            "stop-opacity",
            opacity
        );

        gradient.appendChild(stop);
    }

    defs.appendChild(gradient);

    svg.appendChild(defs);
}

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

    let ondaPrincipal =
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
            ) * .22;

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
            ) * .45;
    }

    ondaMicro *=
        config.microForca;

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

    const centro =
        nivel - .5;

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
            ponto /
            config.pontos;

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
        "stroke-width",
        linha ===
        Math.floor(
            config.linhas / 2
        )
            ? "2.8"
            : "1.6"
    );

    return path;
}

function criarSVG(fase) {

    const config =
        configuracoes[fase];

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

    criarGradiente(svg);

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

function gerarLinhasMusicais() {

    if (
        !containerBase ||
        !containerGlow
    ) {
        return;
    }

    const faseAtiva =
        document.querySelector(
            'input[name="phase"]:checked'
        )?.id || "phase1";

    const svg =
        criarSVG(faseAtiva);

    const svgGlow =
        svg.cloneNode(true);

    containerBase.replaceChildren(
        svg
    );

    containerGlow.replaceChildren(
        svgGlow
    );
}

function atualizarMouse() {

    mouseFrame = null;

    containerGlow.style.setProperty(
        "--mouse-x",
        `${mouseX}px`
    );

    containerGlow.style.setProperty(
        "--mouse-y",
        `${mouseY}px`
    );
}

if (
    site &&
    containerGlow
) {

    site.addEventListener(
        "mousemove",
        event => {

            const rect =
                site.getBoundingClientRect();

            mouseX =
                event.clientX -
                rect.left;

            mouseY =
                event.clientY -
                rect.top;

            if (!mouseFrame) {

                mouseFrame =
                    requestAnimationFrame(
                        atualizarMouse
                    );
            }

        },
        {
            passive: true
        }
    );

    site.addEventListener(
        "mouseleave",
        () => {

            mouseX = -1000;
            mouseY = -1000;

            if (!mouseFrame) {

                mouseFrame =
                    requestAnimationFrame(
                        atualizarMouse
                    );
            }
        }
    );
}

for (const fase of fases) {

    fase.addEventListener(
        "change",
        () => {

            atualizarTexto(
                fase.id
            );

            gerarLinhasMusicais();
        }
    );
}

gerarLinhasMusicais();

const faseInicial =
    document.querySelector(
        'input[name="phase"]:checked'
    );

if (faseInicial) {

    atualizarTexto(
        faseInicial.id
    );
}