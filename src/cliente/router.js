import express from 'express';
import { Pool } from 'pg';

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'aula-07-10-2025',
});

const router = express.Router();

const clientes = [];

async function findById(id, res) {
    const sql = 'select * from cliente where id = $1';
    const { rows } = await connection.query(sql, [id]);
    const [cliente] = rows;
    if (!cliente) {
        return res.status(404).json({
            error: true,
            message: 'Cliente não encontrado'
        });
    }
    return cliente;
}

// GET    http://localhost:3000/cliente - Listar todos os clientes
router.get('/', async (req, res) => {
    const sql = 'select * from cliente order by id';
    const { rows } = await connection.query(sql);
    return res.json(rows);
})

// GET    http://localhost:3000/cliente/:id - Obtem um cliente pelo seu identificador
router.get('/:id', async (req, res) => {
    const cliente = await findById(req.params.id, res);
    if (cliente) {
        return res.json(cliente);
    }    
})

const getNextId = async () => {
    const { rows } = await connection.query('select max(id) as max from cliente');
    const [row] = rows;
    if (!row) return 1;
    return row.max + 1;    
}

// POST   http://localhost:3000/cliente Cria um novo cliente
router.post('/', async (req, res) => {
    const id = clientes.length + 1;
    try {
        const id = await getNextId();
        const { nome, apelido } = req.body;
        await connection.query(sql);
        await connection.query('insert into cliente (id, nome, apelido) values ($1, $2, $3)', [id, nome, apelido]);
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
router.put('/:id', async (req, res) => {
    await connection.query('update cliente set nome = $1 where id = $2', [req.body.nome, req.params.id])
    res.json({
        message: 'Cliente atualizado com sucesso'
    })
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