/* Dom7 */
var $$ = Dom7;
var VersaoBanco;
var versaoServidor = true;
var idUsuarioPesquisa;
/* Init App */
var myApp = new Framework7({
    id: "io.framework7.testapp",
    name: "Agritrade",
    root: "#app",
    theme: "md",
    touch: {
        fastClicks: false,
        tapHold: false //enable tap hold events
    },
    popup: {
        closeByBackdropClick: false,
    }
});
var p_text = anime({
    targets: '#projeto-desktop-text',
    top: ['200px', '0px'],
    duration: 700,
    easing: 'easeOutElastic',
    loop: 1,
    autoplay: true
});

$(".menu-quadrado").click(function(el) {
    var texto = this.parentNode.children[1].innerHTML;
    $(".menu-quadrado").removeClass('active');
    $(this).addClass('active');
    $("#projeto-desktop-text").html(texto);
    p_text.restart();
});
var meses = [
    "Janeiro",
    "Fevereiro",
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
]

var clients = [];
for (let i = 0; i < 6; i++) {
    clients.push(anime({
        targets: '.cliente:nth-of-type(' + i + ')',
        width: ['0%', '100%'],
        delay: 50 + (i * 200),
        duration: 1500,
        complete: function(anim) {
            anime({
                targets: '.cliente:nth-of-type(' + i + ') .descricao',
                opacity: ['0', '1'],
                duration: 1500,
                easing: 'linear',
                loop: 1,
                autoplay: true
            })
        },
        easing: 'easeOutQuad',
        loop: 1,
        autoplay: false
    }));
}

function fechar_downloads() {
    $('#modal-download').fadeOut();
}

$(document).ready(function() {
    if (detectar_mobile() == true) {
        $(".desktop").addClass("display-none");
        $(".mobile").removeClass("display-none");
        $('#fullpage').fullpage({
            autoScrolling: true,
            navigation: true,
            verticalCentered: false,
            css3: true,
            easingcss3: "ease",
            anchors: ['home',
                'funcionamobile',
                'funciona',
                'lingeries',
                'amigas',
                'siganos',
            ],
            menu: '#menu',
            navigationTooltips: ['Quem somos',
                'Quem Somos',
                'Como funciona',
                'Lingeries',
                'Amigas',
                'Siga-nos',
            ],
            responsiveWidth: 769,
            onLeave: function(origin, destination, direction) {
                var leavingSection = this;

                if (origin.isFirst && direction == 'down') {
                    $("#app-bar").addClass("top");
                    //circ.restart();
                } else if (destination.isFirst) {
                    $("#app-bar").removeClass("top");
                }
                // if (origin.anchor == "funciona") {
                //     if (screen.width < 769) {
                //         $("#modal").fadeOut();
                //     }
                // }

            },
            afterLoad: function(origin, destination, direction) {
                var loadedSection = this;

                if (screen.width > 768) {
                    parallax(origin, destination, direction);
                }

                if (destination.anchor == "vantagens") {
                    clients.forEach(element => {
                        element.play();
                    });
                } else if (destination.anchor == "funciona") {
                    if (screen.width < 769) {
                        $("#sec-funciona .toolbar .logo")[0].click();
                    } else {
                        $('#sec-funciona .cellphone-extension').addClass("active");
                        cell_ext_title.play();
                        cell_ext_text.play();
                    }
                }
                // } else if (destination.anchor == "projeto") {
                //     $("#videoProjeto")[0].play();
                // }

            }


        });
    } else {
        $("#sec-funcionamobile").remove();
        $(".mobile").addClass("display-none");
        $(".desktop").removeClass("display-none");
        $('#fullpage').fullpage({
            autoScrolling: true,
            navigation: true,
            verticalCentered: false,
            css3: true,
            easingcss3: "ease",
            anchors: ['home',
                'funciona',
                'lingeries',
                'amigas',
                'siganos',
            ],
            menu: '#menu',
            navigationTooltips: ['Quem somos',
                'Como funciona',
                'Lingeries',
                'Amigas',
                'Siga-nos',
            ],
            responsiveWidth: 769,
            onLeave: function(origin, destination, direction) {
                var leavingSection = this;

                if (origin.isFirst && direction == 'down') {
                    $("#app-bar").addClass("top");
                    //circ.restart();
                } else if (destination.isFirst) {
                    $("#app-bar").removeClass("top");
                }
                // if (origin.anchor == "funciona") {
                //     if (screen.width < 769) {
                //         $("#modal").fadeOut();
                //     }
                // }

            },
            afterLoad: function(origin, destination, direction) {
                var loadedSection = this;

                if (screen.width > 768) {
                    parallax(origin, destination, direction);
                }

                if (destination.anchor == "vantagens") {
                    clients.forEach(element => {
                        element.play();
                    });
                } else if (destination.anchor == "funciona") {
                    if (screen.width < 769) {
                        $("#sec-funciona .toolbar .logo")[0].click();
                    } else {
                        $('#sec-funciona .cellphone-extension').addClass("active");
                        cell_ext_title.play();
                        cell_ext_text.play();
                    }
                }
                // } else if (destination.anchor == "projeto") {
                //     $("#videoProjeto")[0].play();
                // }

            }


        });
    }

    var SPMaskBehavior = function(val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };
    var spOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };

    $('#telefone').mask(SPMaskBehavior, spOptions);

    $('#email').mask("A", {
        translation: {
            "A": { pattern: /[\w@\-.+]/, recursive: true }
        }
    });
});

function detectar_mobile() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

function parallax(origin, destination, direction) {
    var url_home = "url('imgs/bg1.jpg')";
    var url_funciona = "url('imgs/bg2.jpg')";
    var url_lingeries = "url('imgs/bg3.jpg')";
    var url_amigas = "url('imgs/bg4.jpg')";
    var url_siganos = "url('imgs/bg5.jpg')";
    if (detectar_mobile()) {
        var url_home = "url('imgs/mobile/BG1.jpg')";
        var url_funcionamobile = "url('imgs/mobile/BG2.jpg')";
        var url_funciona = "url('imgs/mobile/BG3.jpg')";
        var url_lingeries = "url('imgs/mobile/BG4.jpg')";
        var url_amigas = "url('imgs/mobile/BG5.jpg')";
        var url_siganos = "url('imgs/mobile/BG6.jpg')";
        $('#sec-funcionamobile').css("background-image", url_funcionamobile);
    }
    // if (destination.anchor == "home") {
    $('#bg-parallax').css("background-image", url_home);
    $('#sec-home').css("background-image", url_home);

    $('#sec-funciona').css("background-image", url_funciona);
    $('#sec-lingeries').css("background-image", url_lingeries);
    $('#sec-amigas').css("background-image", url_amigas);
    $('#sec-siganos').css("background-image", url_siganos);

    // } else if (destination.anchor == "modelo") {
    //     $('#bg-parallax').css("background-image", url_modelo);
    //     $('#sec-modelo').css("background-image", url_modelo);

    //     $('#sec-home').css("background-image", url_home);
    //     $('#sec-projeto').css("background-image", url_projeto);

    //     p_text.play();
    // } else if (destination.anchor == "projeto") {
    //     $('#bg-parallax').css("background-image", url_projeto);
    //     $('#sec-projeto').css("background-image", "none");

    //     $('#sec-home').css("background-image", url_home);
    //     $('#sec-modelo').css("background-image", url_modelo);
    // } else if (destination.anchor == "projeto") {
    //     $('#bg-parallax').css("background-image", url_planos);
    //     $('#sec-planos').css("background-image", "none");

    //     $('#sec-home').css("background-image", url_home);
    //     $('#sec-modelo').css("background-image", url_modelo);

    // } else if (destination.anchor == "vantagens") {

    // } else if (destination.anchor == "funciona") {

    // }
}



var cell_ext_title = anime({
    targets: '#sec-funciona .cellphone-extension .wrap-title .title',
    left: ['-100%', '0%'],
    delay: 500,
    duration: 2000,
    easing: 'easeOutElastic',
    loop: 1,
    autoplay: false
});

var cell_ext_text = anime({
    targets: '#sec-funciona .cellphone-extension .wrap-text .text',
    left: ['-100%', '0%'],
    delay: 500,
    duration: 2000,
    easing: 'easeOutElastic',
    loop: 1,
    autoplay: false
});

var cell_opacity_text = anime({
    targets: '#sec-funciona .cellphone-extension .wrap-text .text, #sec-funciona .cellphone-extension .wrap-title .title',
    opacity: ['0', '1'],
    duration: 1000,
    easing: 'linear',
    loop: 1,
    autoplay: true
});

$('#sec-funciona .toolbar i, #sec-funciona .toolbar .logo').click(function(el) {
    title = "Como funciona";
    text = "AgriTrade é uma plataforma eletrônica de negócios que conecta os principais players e agentes do mercado de açúcar e etanol. A principal função da ferramenta é auxiliar produtores, empacotadores, atacadistas, distribuidores, revendedores, cooperativas, indústrias e demais envolvidos do setor a conseguirem uma liquidez saudável, para sempre que quiserem comprar ou vender, consigam contraparte a preços justos para o momento.	Além da comercialização, a plataforma disponibiliza informações de mercado em tempo real, facilitando a formação do preço do seu produto e agilizando a tomada de decisão de venda ou compra com base nas paridades e equivalências de mercado.<br> Instale o AgriTrade e desfrute das vantagens oferecidas pela plataforma, o cadastro é simples, prático e sem complicação.";

    if (screen.width > 768) {
        $('#sec-funciona .cellphone-extension .title').text(title);
        $('#sec-funciona .cellphone-extension .text').html(text);
        cell_opacity_text.restart();
    } else {
        $("#modal .title").text(title);
        $("#modal .text").html(text);
        $("#modal").fadeIn();
    }
});

$("#sec-funciona .cellphone .apk .content .apk-row .button .img").click(function(el) {
    let title = $(el.currentTarget.parentElement.children[1]).text();
    let text = "texto";
    switch ($(el.currentTarget.parentElement).attr("data-serv")) {
        case "cotacoes":
            text = "Neste módulo o usuário pode ter acesso as principais cotações do mercado futuro e indicadores de preço relacionados ao mercado de açúcar e etanol.";
            break;
        case "bid-acucar":
            text = "Este módulo possibilita que os Vendedores informem na plataforma os produtos que estão ofertando e o preço desejado. Os compradores por sua vez relatam o que estão em busca e quanto desejam pagar. Os participantes definem os termos do negócio, que podem ser completamente adequados às necessidades específicas de cada parte. Aqui ficarão centralizadas exclusivamente as negociações de Açúcar.";
            break;
        case "bid-etanol":
            text = "As negociações entre comprador e vendedor podem ser acompanhadas através desta seção, também conhecida como Livro de Oferta e Demanda. Os Usuários podem interagir digitalmente e de forma muito mais rápida e segura, diretamente da palma da mão através do seu smartphone ou se preferirem, através da plataforma web. Aqui ficarão centralizadas exclusivamente as negociações de Etanol.";
            break;
        case "par-spot":
            text = "Este módulo é destinado para o acompanhamento das paridades e equivalências, histórica e spot, dos produtos e mercados da indústria de cana de açúcar. Avalie aqui as equivalências do açúcar e etanol e das paridades do mercado doméstico e mercado externo.";
            break;
        case "par-futura":
            text = "Através dessa seção o usuário poderá acompanhar as paridades e equivalências futuras com base nas cotações do mercado futuro de açúcar, etanol e dólar e nas premissas calibradas pelo usuário (logística, custo de produção, impostos e etc). Encontre aqui o preço justo para seu produto com base nas informações mais recentes do mercado.";
            break;
        case "par-calculadora":
            text = "Similar aos módulos de paridades, aqui o usuário poderá ajustar todas as premissas de cálculo (mercado, logística, impostos, custo produção e etc). Ótima ferramenta para auxiliar o processo de negociação, avaliar propostas de compradores e vendedores e identificar o breakeven dos produtos e mercados.";
            break;
        case "noticias":
            text = "Fique atualizado e acompanhe as notícias mais recentes relacionadas ao mercado de açúcar e etanol.";
            break;
        case "negociacoes":
            text = "Seção destinada para o gerenciamento, inclusão e acompanhamento das propostas abertas, em fase de negociação e concluídas, sejam elas de compra ou venda. Aqui podem ser fechadas negociações no mercado à vista (spot) e no mercado a termo (contratos de liquidação futura). Contrapropostas e interações com potenciais compradores e vendedores poderão ser feitas por aqui ou através da seção Bid & Offer.";
            break;
        case "gerencial":
            text = "Seção destinada para o gerenciamento das principais funções do aplicativo, bem como calibração das premissas que são utilizadas para cálculos das paridades e equivalências.";
            break;
        case "previsao":
            text = "Em especial para o mercado de etanol e mercado externo, acompanhe aqui a previsão do tempo das principais regiões produtoras e portos.";
            break;
        case "notificacoes":
            text = "Receba aqui os principais alertas e propostas das suas negociações.";
            break;
        case "fale":
            text = "Problemas, dúvidas e sugestões poderão ser direcionadas para nossa equipe técnica diretamente por aqui.";
            break;
        default:
            break;
    }

    if (screen.width > 768) {
        $('#sec-funciona .cellphone-extension .title').text(title);
        $('#sec-funciona .cellphone-extension .text').text(text);
        cell_opacity_text.restart();
    } else {
        $("#modal .title").text(title);
        $("#modal .text").text(text);
        $("#modal").fadeIn();
    }
});


$('#modal button, #modal').click(function(el) {
    if (el.target.id == 'modal' || el.target.className == 'btn') {
        $("#modal").fadeOut();
    }

});

$('#menu-icon').click(function(el) {
    if ($('#app-bar').hasClass("active")) {
        $('#app-bar').removeClass("active");
        $("#menu-icon > i").removeClass("fa-arrow-up");
        $("#menu-icon > i").addClass("fa-bars");
    } else {
        $('#app-bar').addClass("active");
        $("#menu-icon > i").removeClass("fa-bars");
        $("#menu-icon > i").addClass("fa-arrow-up");
    }
});

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function GetVersaoApp() {
    parametros = {};
    var obj = {
        oficial: versaoServidor,
        aplicacao: "app"
    };
    parametros = {
        obj: JSON.stringify(obj)
    }
    var GetVersaoApp = Promise.resolve(
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            data: parametros,
            url: "https://app.agritrade.com.br/Versionador/versao?tela=GetVersao"
        })
    );
    // versaoServidor = "_producao"
    GetVersaoApp.then(function(dados) {
        VersaoBanco = dados.msg;
        return "ok";
    }, function(e) {
        console.log(e);
    });
}

function Promessa(parametros) {
    this.promessa = async function() {
        var url = "http://sistema.agely.com.br/sites";
        var r = await Promise.resolve(jQuery.ajax({ type: "POST", dataType: "json", data: parametros, url: url }));
        return r;
    }
}


function Promessa2(tela, parametros) { // Faz a comunicação com o servidor
    if (VersaoBanco == undefined)
        GetVersaoApp();

    if (!parametros)
        parametros = {};

    VersaoBanco = "http://127.0.0.1:8080/AgritradeServer/";
    var url = VersaoBanco + "agritrade?tela=" + tela;
    return Promise.resolve(
        jQuery.ajax({
            type: "POST",
            dataType: "json",
            data: parametros,
            url: url
        })
    );
}


function trocavideoinformativo(video) {
    if (video == 'cadastro_pf') {
        $('#videoinformativo').attr('src', 'https://www.youtube.com/embed/mOZ4OUw06es')
    } else if (video == 'selecione_empresa') {
        $('#videoinformativo').attr('src', 'https://www.youtube.com/embed/-DveB2yC4Wc')
    } else if (video == 'selecione_empresa_autorizada') {
        $('#videoinformativo').attr('src', 'https://www.youtube.com/embed/XQPtbguTR7w')
    } else if (video == 'lances_ofertas') {
        $('#videoinformativo').attr('src', 'https://www.youtube.com/embed/Ig5d2W5Zpc8')
    }
}

async function gravaContato() {
    var nome = $("#nome").val();
    var email = $("#email").val();
    var telefone = $("#telefone").val();
    var mensagem = $("#mensagem").val();

    if (nome != '') {
        if (isEmail(email)) {
            if (mensagem != '') {
                var parametros = { nome: nome, email: email, telefone: telefone, mensagem: mensagem, site: 'agritrade', tela: 'CadastraContato' };
                var pContato = new Promessa(parametros);
                pContato.promessa();
                $("#nome").val('');
                $("#email").val('');
                $("#telefone").val('');
                $("#mensagem").val('');
                alert('Contato enviado!');
            } else {
                alert('O campo [Mensagem] é obrigatório!');
            }
        } else {
            alert('O campo [Email] é obrigatório!');
        }
    } else {
        alert('O campo [Nome] é obrigatório!');
    }

}

function adicionarContador(loja) {
    var parametros = {};
    parametros = {
        obj: JSON.stringify({ producao: false })
    };
    console.log(parametros)
    $.ajax({
        type: "POST",
        dataType: "json",
        data: parametros,
        url: 'https://app.agritrade.com.br/Versionamento/agritrade?tela=GetVersao'
    }).done(function(data) {
        console.log(data);
        var parametros = {};
        parametros = {
            obj: JSON.stringify({
                'loja': loja,
            })
        };
        $.ajax({
            type: "POST",
            dataType: "json",
            data: parametros,
            url: data.msg + "agritrade?tela=" + 'SetContador'
        })


    })
}

function abrirPopup(video) {
    if (video == 1) {
        var conteudoVideo = "<iframe class='iframemodal' src='https://www.youtube.com/embed/mOZ4OUw06es'></iframe>"
    }
    if (video == 2) {
        var conteudoVideo = "<iframe class='iframemodal' src='https://www.youtube.com/embed/-DveB2yC4Wc'></iframe>"
    }
    if (video == 3) {
        var conteudoVideo = "<iframe class='iframemodal' src='https://www.youtube.com/embed/XQPtbguTR7w'></iframe>"
    }
    if (video == 4) {
        var conteudoVideo = "<iframe class='iframemodal' src='https://www.youtube.com/embed/Ig5d2W5Zpc8'></iframe>"
    }
    var popup = myApp.popup.create({
        content: '<div class="popup"><a class="link popup-close" style="padding-left:95%; color: white; font-size: 15pt">X</a>' + conteudoVideo + ' </div>',
        on: {
            opened: function() {
                console.log('Popup opened')
            }
        }
    });
    popup.open();
}

function getAllFaq() {
    if (VersaoBanco == undefined) {
        GetVersaoApp();
        setTimeout(function() {
            getAllFaq()
        }, 3000);
    } else {
        var GetAllFaqDuvidasSite = new Promessa2("GetAllFaqDuvidasSite");
        GetAllFaqDuvidasSite.then(function(dados) {
            if (dados.situacao == "erro") {
                alert(dados.msg);
            } else {
                $("#listaFaq").html();
                var faqs = dados.arrayObj;
                faqs = faqs.sort(function(a, b) {
                    var keyA = new Date(a.id_faq_grupo),
                        keyB = new Date(b.id_faq_grupo);
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
                var grupoAnterior;
                for (var a in faqs) {
                    if (grupoAnterior != faqs[a].grupo) {
                        $("#listaFaq").append(
                            '<div class="titulo">' +
                            faqs[a].grupo +
                            '</div>'
                        );
                        grupoAnterior = faqs[a].grupo;
                    }
                    $("#listaFaq").append(
                        '<li class="accordion-item">' +
                        '    <a href="" class="item-link item-content">' +
                        '        <div class="item-inner">' +
                        '            <div class="item-title">' +
                        faqs[a].pergunta +
                        '        </div>' +
                        '        </div>' +
                        '    </a>' +
                        '    <div class="accordion-item-content">' +
                        faqs[a].resposta +
                        '    </div>' +
                        '</li>'
                    );
                }
            }
        });
    }
}

function getValoresPracas() {
    if (VersaoBanco == undefined) {
        GetVersaoApp();
        setTimeout(function() {
            getValoresPracas();
        }, 300);
    } else {
        var GetValoresPracas = new Promessa2("GetValoresPracas");
        GetValoresPracas.then(function(dados) {
            if (dados.situacao == "erro") {
                alert(dados.msg);
            } else {
                var pracas = dados.arrayObj;
                var acucar = [];
                var etanol = [];
                for (var a in pracas) {
                    if (pracas[a].tipoProduto == 1) {
                        acucar.push(pracas[a])
                    } else {
                        etanol.push(pracas[a])
                    }
                }
                $("#cardBidsEtanol").html("");
                $("#cardBidsAcucar").html("");

                if (etanol.length == 0) {
                    $("#cardBidsEtanol").append(
                        '<div class="row rowlinha alinhamento-central" colspan="2">' +
                        '    <div class="col-30  conteudo1 alinhamento-central">' +
                        '       Nâo há dados para Etanol!' +
                        '    </div>' +
                        '    <div class="col-35   alinhamento-central">...</div>' +
                        '    <div class="col-35   alinhamento-central">...</div>' +

                        '</div>');
                }
                if (acucar.length == 0) {
                    $("#cardBidsAcucar").append(
                        '<div class="row rowlinha alinhamento-central" colspan="2">' +
                        '    <div class="col-30  conteudo1 alinhamento-central">' +
                        '       Nâo há dados para Açúcar!' +
                        '    </div>' +
                        '    <div class="col-35   alinhamento-central">...</div>' +
                        '    <div class="col-35   alinhamento-central">...</div>' +

                        '</div>');
                }
                preenchePracas(acucar, "Acucar");
                preenchePracas(etanol, "Etanol");
            }
        });
    }
}

function preenchePracas(pracas, tipo) {

    pracas = pracas.sort(function(a, b) {
        var keyA = new Date(a.data),
            keyB = new Date(b.data);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    });
    var grupoAnterior;
    for (var a in pracas) {
        if (grupoAnterior != pracas[a].data) {
            $("#cardBids" + tipo).append(
                '<div class="row rowlinha " id="conteudo' + tipo + pracas[a].data.split("-").join("_") + '">' +
                '    <div class="col-30  conteudo1 alinhamento-central">' +
                '    <div class="marcador">' +
                '    </div>' +
                '        <div class="tituloconteudo">' + pracas[a].data.split("-")[2] + '</div>' +
                '        <div class="subtituloconteudo">de ' + meses[parseInt(pracas[a].data.split("-")[1]) - 1] + '</div>' +
                '    </div>' +
                '    <div class="col-35   alinhamento-central" id="conteudo2' + tipo + pracas[a].data + '"></div>' +
                '    <div class="col-35   alinhamento-central" id="conteudo3' + tipo + pracas[a].data + '"></div>' +
                '</div>'
            );
            grupoAnterior = pracas[a].data;
        }
        if (pracas[a].tipo == "D") {
            var lista = "#conteudo2" + tipo + pracas[a].data;
            var cor = "conteudo2"
        } else {
            var lista = "#conteudo3" + tipo + pracas[a].data;
            var cor = "conteudo3"
        }
        $(lista).append(
            '<div class="' + cor + ' alinhamento-central">' +
            '    <div class="nomeproposta">' + pracas[a].numRegistro + ' - ' + pracas[a].produto + '</div>' +
            '    <div class="localproposta">' + pracas[a].mesorregiao + ' - ' + pracas[a].estado + '</div>' +
            '    <div class="row">' +
            // '        <div class="col alinhamento-esquerda" id="distancia' + pracas[a].idpraca + '"><img src="" width="10px">270 km</div>' +
            '        <div class="col alinhamento-central">R$ ' + numberToReal(pracas[a].preco) + '/' + pracas[a].sigla + (tipo == "Etanol" ? ' <div class="x-small">Preço Liquido* (Sem IPI e Sem ICMS)</div>' : ' <div class="x-small">Preço Bruto (com 7% de ICMS)</div>') + '</div>' +
            '    </div>' +
            '</div>'
        );
        // calculaDistancia(pracas[a].idpraca, pracas[a].latitude, pracas[a].longitude)
    }
    for (var a in pracas) {
        if ($("#conteudo2" + tipo + pracas[a].data).html() == "") {
            $("#conteudo2" + tipo + pracas[a].data).html(
                '       <div class="conteudo2 alinhamento-central">' +
                '           Não temos dados para essa data' +
                '       </div>');
        }
        if ($("#conteudo3" + tipo + pracas[a].data).html() == "") {
            $("#conteudo3" + tipo + pracas[a].data).html(
                '       <div class="conteudo3 alinhamento-central">' +
                '           Não temos dados para essa data' +
                '       </div>');
        }
    }

    verificaData(pracas, undefined, undefined, 0, tipo)
}

function numberToReal(numero) { // Deixa numero dizima com 2 casas decimais 
    numero = numero.toString().split(",").join(".")
    if (numero == undefined || numero == "") {
        numero = 0;
    } else {
        numero = parseFloat(numero);
    }
    var numero = numero.toFixed(3).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/)
        .join('.');
    return numero.join(',');
}

// function calculaDistancia(iddisatancia, lat, long) {
//     var distancia = calcDistance({
//         lat1: latitudeSite,
//         lon1: longitudeSite,
//         lat2: lat,
//         lon2: long
//     });
//     console.log(distancia)
//     $("#distancia" + iddisatancia).html(distancia)
// }

// function calcDistance(data) { // ex {lat1: -20.929063 , lon1: -46.994551, lat2: -20.7260688, lon2: -46.6174426}
//     var radlat1 = Math.PI * data["lat1"] / 180;
//     var radlat2 = Math.PI * data["lat2"] / 180;
//     var theta = data["lon1"] - data["lon2"];
//     var radtheta = Math.PI * theta / 180;
//     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     if (dist > 1) {
//         dist = 1;
//     }
//     dist = Math.acos(dist);
//     dist = dist * 180 / Math.PI;
//     dist = dist * 60 * 1.1515;
//     dist = dist * 1.609344
//     return dist.toFixed(0);
// }


// function showPosition(position) {
//     latitudeSite = position.coords.latitude;
//     longitudeSite = position.coords.longitude;
//     getValoresPracas();
// }

var dataProxima;

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function verificaData(pracas, proximo, acima, num, tipo) {
    var data = new Date();
    var dataAtual = data.getFullYear() + "-" + ((data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1)) + "-" + ((data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate()));
    if (proximo != undefined) {
        if (acima == true) {
            var data = addDays(dataAtual, num)
            var dataAtual = data.getFullYear() + "-" + ((data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1)) + "-" + ((data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate()));
        } else {
            var data = addDays(dataAtual, -num);
            var dataAtual = data.getFullYear() + "-" + ((data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1)) + "-" + ((data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate()));
        }
    }
    var encontrou = false;
    for (var a in pracas) {
        if (dataAtual == pracas[a].data) {
            encontrou = true;
            dataProxima = dataAtual;
        }
    }
    if (encontrou == false) {
        if (acima == undefined || acima == false) {
            acima = true;
            num = num + 1;
        } else { acima = false }
        proximo = true;
        verificaData(pracas, proximo, acima, num, tipo);
    } else {
        if (encontrou) {
            var testDiv = document.getElementById('conteudo' + tipo + dataProxima.split("-").join("_"));
            console.log("#conteudo" + tipo + dataProxima.split("-").join("_"));
            $("#conteudo" + tipo + dataProxima.split("-").join("_")).addClass("vermelho");
            $("#cardBids" + tipo).parent().scrollTop(testDiv.offsetTop - 100)
        }
    }
}