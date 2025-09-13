// Variáveis globais
let carrinho = [];
let modalAberto = null;

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    esconderFormulariosPagamento();
});

// Inicializar eventos
function inicializarEventos() {
    // Eventos do carrinho
    document.getElementById('carrinho-btn').addEventListener('click', function(e) {
        e.preventDefault();
        abrirModal('carrinho-modal');
    });
    
    document.getElementById('finalizar-compra').addEventListener('click', function() {
        fecharModal('carrinho-modal');
        abrirModal('checkout-modal');
    });
    
    // Eventos de fechar modais
    document.querySelectorAll('.close').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            fecharModal(modalId);
        });
    });
    
    // Evento de submit do formulário de checkout
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        finalizarPedido();
    });
    
    // Evento para voltar à página inicial
    document.getElementById('voltar-inicio').addEventListener('click', function() {
        fecharModal('confirmacao-modal');
        limparCarrinho();
    });
    
    // Evento para alterar forma de pagamento
    document.getElementById('pagamento').addEventListener('change', function() {
        mostrarFormaPagamento(this.value);
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            fecharModal(e.target.id);
        }
    });
}

// Funções do carrinho
function alterarQuantidade(produtoId, alteracao) {
    const quantidadeElemento = document.getElementById(`qtd-${produtoId}`);
    let quantidade = parseInt(quantidadeElemento.textContent);
    quantidade += alteracao;
    
    if (quantidade < 1) quantidade = 1;
    
    quantidadeElemento.textContent = quantidade;
}

function adicionarAoCarrinho(produtoId, nome, preco, imagem) {
    const quantidade = parseInt(document.getElementById(`qtd-${produtoId}`).textContent);
    
    // Verificar se o produto já está no carrinho
    const index = carrinho.findIndex(item => item.id === produtoId);
    
    if (index !== -1) {
        // Atualizar quantidade se o produto já existir
        carrinho[index].quantidade += quantidade;
    } else {
        // Adicionar novo produto ao carrinho
        carrinho.push({
            id: produtoId,
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: quantidade
        });
    }
    
    // Resetar quantidade para 1
    document.getElementById(`qtd-${produtoId}`).textContent = '1';
    
    // Atualizar contador do carrinho
    atualizarContadorCarrinho();
    
    // Mostrar mensagem de sucesso
    alert('Produto adicionado ao carrinho!');
}

function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    atualizarCarrinho();
    atualizarContadorCarrinho();
}

function atualizarCarrinho() {
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoTotal = document.getElementById('carrinho-total');
    
    carrinhoItens.innerHTML = '';
    let total = 0;
    
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = '<p>Seu carrinho está vazio.</p>';
        carrinhoTotal.textContent = '0,00';
        return;
    }
    
    carrinho.forEach(item => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;
        
        const itemElemento = document.createElement('div');
        itemElemento.classList.add('carrinho-item');
        itemElemento.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="carrinho-item-info">
                <h4 class="item-nome">${item.nome}</h4>
                <p class="item-preco">R$ ${item.preco.toFixed(2)}</p>
                <p class="item-quantidade">Quantidade: ${item.quantidade}</p>
            </div>
            <p class="carrinho-item-preco">R$ ${itemTotal.toFixed(2)}</p>
            <button class="remover-item" onclick="removerDoCarrinho('${item.id}')">Remover</button>
        `;
        
        carrinhoItens.appendChild(itemElemento);
    });
    
    carrinhoTotal.textContent = total.toFixed(2);
}

function atualizarContadorCarrinho() {
    const countElement = document.getElementById('carrinho-count');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    countElement.textContent = totalItens;
}

function limparCarrinho() {
    carrinho = [];
    atualizarContadorCarrinho();
}

// Funções de modal
function abrirModal(modalId) {
    if (modalId === 'carrinho-modal') {
        atualizarCarrinho();
    }
    
    document.getElementById(modalId).style.display = 'block';
    modalAberto = modalId;
    document.body.style.overflow = 'hidden';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    modalAberto = null;
    document.body.style.overflow = 'auto';
}

// Funções de pagamento
function esconderFormulariosPagamento() {
    document.getElementById('pix-form').style.display = 'none';
    document.getElementById('cartao-form').style.display = 'none';
    document.getElementById('boleto-form').style.display = 'none';
}

function mostrarFormaPagamento(forma) {
    esconderFormulariosPagamento();
    
    switch(forma) {
        case 'pix':
            document.getElementById('pix-form').style.display = 'block';
            break;
        case 'cartao':
            document.getElementById('cartao-form').style.display = 'block';
            break;
        case 'boleto':
            document.getElementById('boleto-form').style.display = 'block';
            break;
        default:
            // Nada a mostrar
    }
}

// Função para ampliar imagem
function ampliarImagem(src) {
    document.getElementById('imagem-ampliada').src = src;
    abrirModal('imagem-modal');
}

// Finalização do pedido
function finalizarPedido() {
    // Coletar dados do formulário
    const cliente = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value
    };
    
    const endereco = {
        cep: document.getElementById('cep').value,
        endereco: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };
    
    const pagamentoSelect = document.getElementById('pagamento');
    const pagamento = pagamentoSelect.options[pagamentoSelect.selectedIndex].text;
    
    // Calcular total
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    // Gerar link do WhatsApp
    const whatsappLink = gerarLinkWhatsApp(cliente, endereco, pagamento, total);
    document.getElementById('whatsapp-link').href = whatsappLink;
    
    // Preencher resumo do pedido
    document.getElementById('resumo-total').textContent = total.toFixed(2);
    document.getElementById('resumo-pagamento').textContent = pagamento;
    
    const resumoItens = document.getElementById('resumo-itens');
    resumoItens.innerHTML = '';
    
    carrinho.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('resumo-item');
        itemElement.innerHTML = `
            <p>${item.nome} - Quantidade: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
        `;
        resumoItens.appendChild(itemElement);
    });
    
    // Mostrar modal de confirmação
    fecharModal('checkout-modal');
    abrirModal('confirmacao-modal');
}

// Gerar link do WhatsApp
function gerarLinkWhatsApp(cliente, endereco, pagamento, total) {
    const numeroWhatsApp = "5591982476739";
    
    // Montar a mensagem com os detalhes do pedido
    let mensagem = `Olá! Gostaria de finalizar meu pedido na MKD CanineStyle.%0A%0A`;
    mensagem += `*Resumo do Pedido:*%0A`;
    
    carrinho.forEach(item => {
        mensagem += `- ${item.nome} (Qtd: ${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });
    
    mensagem += `%0A*Total: R$ ${total.toFixed(2)}*%0A%0A`;
    mensagem += `*Dados Pessoais:*%0A`;
    mensagem += `Nome: ${cliente.nome}%0A`;
    mensagem += `E-mail: ${cliente.email}%0A`;
    mensagem += `Telefone: ${cliente.telefone}%0A`;
    mensagem += `CPF: ${cliente.cpf}%0A%0A`;
    
    mensagem += `*Endereço de Entrega:*%0A`;
    mensagem += `${endereco.endereco}, ${endereco.numero}%0A`;
    if (endereco.complemento) {
        mensagem += `Complemento: ${endereco.complemento}%0A`;
    }
    mensagem += `Bairro: ${endereco.bairro}%0A`;
    mensagem += `Cidade: ${endereco.cidade}%0A`;
    mensagem += `Estado: ${endereco.estado}%0A`;
    mensagem += `CEP: ${endereco.cep}%0A%0A`;
    
    mensagem += `*Forma de Pagamento:* ${pagamento}`;
    
    return `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
}