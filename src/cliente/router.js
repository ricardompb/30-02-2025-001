import express from 'express';
import utils from '../utils.js'

const router = express.Router();

const clientes = [
    { id: 1, nome: 'Ricardo', apelido: 'Ricardo' },
    { id: 2, nome: 'Maria', apelido: 'Mary' },
    { id: 3, nome: 'João', apelido: 'João' },
];

function findById(id, res) {
    const cliente = clientes.find(c => c.id === parseInt(id));
    if (!cliente) {
        return res.status(404).json({
            error: true,
            message: 'Cliente não encontrado'
        });
    }
    return cliente;
}

// GET    http://localhost:3000/cliente - Listar todos os clientes
router.get('/', (req, res) => {
    res.json(clientes);
})

// GET    http://localhost:3000/cliente/:id - Obtem um cliente pelo seu identificador
router.get('/:id', (req, res) => {
    const cliente = findById(req.params.id, res);
    if (cliente) {
        return res.json(cliente);
    }    
})

// POST   http://localhost:3000/cliente Cria um novo cliente
router.post('/', (req, res) => {
    const id = clientes.length + 1;
    try {
        // clientes.push({ id, ...req.body });
        const { nomeApelido, cpf, ...resto } = req.body;

        if (!utils.checkCPF(cpf)) {
            return res.status(400).json({
                error: true,
                message: 'CPF inválido'
            })
        }

        clientes.push({ id, 
            ...resto,
            cpf,
            apelido: nomeApelido
         });

        return res.status(201).json({
            message: 'Cliente cadastrado com sucesso'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
})

// PUT    http://localhost:3000/cliente/:id - Atualiza o cliente pelo seu identificador
router.put('/:id', (req, res) => {
    const cliente = findById(req.params.id, res);
    if (cliente) {
        cliente.nome = req.body.nome;
        return res.json({
            message: 'Cliente atualizado com sucesso'
        })
    }
})

// DELETE http://localhost:3000/cliente/:id - Remove o cliente pelo seu identificador
router.delete('/:id', (req, res) => {
    const cliente = findById(req.params.id, res);
    if (cliente) {
        const index = clientes.indexOf(cliente);
        clientes.splice(index, 1);
        return res.json({
            message: 'Cliente removido com sucesso'
        })
    }
})

export default router;