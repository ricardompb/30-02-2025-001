import express from 'express';
import connection from '../connection.js';

const router = express.Router();

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
        const { rows } = await connection.query('insert into cliente (id, nome, apelido) values ($1, $2, $3) RETURNING id', [id, nome, apelido]);
        const [cliente] = rows;
        return res.status(201).json(cliente)
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
router.delete('/:id', async (req, res) => {
    try {
        await connection.query('delete from cliente where id = $1', [req.params.id]);
        return res.json({
            message: 'Cliente removido com sucesso'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
})

export default router;