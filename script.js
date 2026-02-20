// Classe para gerenciar os contatos
class AgendaContatos {
    constructor() {
        this.contatos = [];
        this.contatoEditando = null;
        this.carregarContatos();
        this.configurarEventos();
        this.atualizarTabela();
    }

    // Carrega contatos do localStorage
    carregarContatos() {
        const contatosSalvos = localStorage.getItem('contatos');
        this.contatos = contatosSalvos ? JSON.parse(contatosSalvos) : [];
    }

    // Salva contatos no localStorage
    salvarContatos() {
        localStorage.setItem('contatos', JSON.stringify(this.contatos));
        this.atualizarContador();
    }

    // Configura todos os eventos da aplicação
    configurarEventos() {
        // Evento do formulário
        document.getElementById('contatoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarOuAtualizarContato();
        });

        // Evento do filtro
        document.getElementById('filtro').addEventListener('input', () => {
            this.filtrarContatos();
        });

        // Evento do botão cancelar
        document.getElementById('btnCancelar').addEventListener('click', () => {
            this.cancelarEdicao();
        });
    }

    // Salva um novo contato ou atualiza um existente
    salvarOuAtualizarContato() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();

        // Validação básica
        if (!nome || !email || !telefone) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (this.contatoEditando) {
            // Atualiza contato existente
            const index = this.contatos.findIndex(c => c.id === this.contatoEditando.id);
            if (index !== -1) {
                this.contatos[index] = {
                    ...this.contatos[index],
                    nome,
                    email,
                    telefone
                };
            }
        } else {
            // Cria novo contato
            const novoContato = {
                id: Date.now().toString(),
                nome,
                email,
                telefone
            };
            this.contatos.push(novoContato);
        }

        this.salvarContatos();
        this.limparFormulario();
        this.atualizarTabela();
        this.cancelarEdicao();
    }

    // Prepara o formulário para edição
    editarContato(id) {
        this.contatoEditando = this.contatos.find(c => c.id === id);
        
        if (this.contatoEditando) {
            document.getElementById('nome').value = this.contatoEditando.nome;
            document.getElementById('email').value = this.contatoEditando.email;
            document.getElementById('telefone').value = this.contatoEditando.telefone;
            
            document.getElementById('btnSalvar').textContent = 'Atualizar Contato';
            document.getElementById('btnCancelar').style.display = 'inline-block';
        }
    }

    // Cancela a edição
    cancelarEdicao() {
        this.contatoEditando = null;
        this.limparFormulario();
        document.getElementById('btnSalvar').textContent = 'Salvar Contato';
        document.getElementById('btnCancelar').style.display = 'none';
    }

    // Exclui um contato
    excluirContato(id) {
        if (confirm('Tem certeza que deseja excluir este contato?')) {
            this.contatos = this.contatos.filter(c => c.id !== id);
            this.salvarContatos();
            
            if (this.contatoEditando && this.contatoEditando.id === id) {
                this.cancelarEdicao();
            }
            
            this.atualizarTabela();
        }
    }

    // Filtra contatos pelo nome
    filtrarContatos() {
        const termo = document.getElementById('filtro').value.toLowerCase();
        this.atualizarTabela(termo);
    }

    // Atualiza a tabela com os contatos
    atualizarTabela(termoFiltro = '') {
        const corpoTabela = document.getElementById('corpoTabela');
        const contatosFiltrados = termoFiltro 
            ? this.contatos.filter(c => c.nome.toLowerCase().includes(termoFiltro))
            : this.contatos;

        if (contatosFiltrados.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-message">
                        ${termoFiltro ? 'Nenhum contato encontrado com este nome.' : 'Nenhum contato cadastrado.'}
                    </td>
                </tr>
            `;
        } else {
            corpoTabela.innerHTML = contatosFiltrados.map(contato => `
                <tr>
                    <td>${this.escapeHtml(contato.nome)}</td>
                    <td>${this.escapeHtml(contato.email)}</td>
                    <td>${this.escapeHtml(contato.telefone)}</td>
                    <td>
                        <button onclick="agenda.editarContato('${contato.id}')" class="acao-btn editar-btn">Editar</button>
                        <button onclick="agenda.excluirContato('${contato.id}')" class="acao-btn excluir-btn">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }

        this.atualizarContador();
    }

    // Atualiza o contador de contatos
    atualizarContador() {
        document.getElementById('totalContatos').textContent = this.contatos.length;
    }

    // Limpa o formulário
    limparFormulario() {
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
        document.getElementById('telefone').value = '';
    }

    // Função para escapar HTML e prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializa a aplicação quando a página carrega
let agenda;
document.addEventListener('DOMContentLoaded', () => {
    agenda = new AgendaContatos();
});