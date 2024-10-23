//Importando o Framework
const express = require('express');

//cookies e sessions
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Iniciar o express
const app = express();

//configurando o uso da biblioteca do cookie
app.use(cookieParser());

//configurar a sessão
app.use(session({
    secret: 'minhachave', //chave secreta para os cookies
    resave: false, //evita regravar as sessões que não se alteraram
    saveUninitialized: true //salva as sessões anônimas
}));

//dados de exemplo
const produtos = [
    {id: 1, nome: "Produto_1", preco: 10},
    {id: 2, nome: "Produto_2", preco: 15},
    {id: 3, nome: "Produto_3", preco: 20}
];

//rota de produtos
app.get('/produtos', (req, res) => {
    res.send(`
        <h1>Lista De Produto</h1>
        <ul>
            ${produtos.map(
                (produto) => 
                `<li>${produto.nome} - ${produto.preco}
                <a href="/adicionar/${produto.id}">Adicionar</a></li>`)
                .join('')
                }
        </ul>
        <a href="/carrinho">Ver Carrinho</a>`
            );
    });

    //rota de adicionar o produto 
    app.get('/adicionar/:id', (req,res)=>{
        const id = parseInt(req.params.id);
        const produto = produtos.find((p) => p.id === id);

        if(produto){
            if(!req.session.carrinho){
                req.session.carrinho = [];
            }
            req.session.carrinho.push(produto);
        }

        res.redirect('/produtos');
    });

    //rota do carrinho
    app.get('/carrinho', (req,res) => {
        const carrinho = req.session.carrinho || [];

        res.send(`

            <h1>Carrinho De Compras</h1>
            <ul>
             ${carrinho.map(
                (produto) => 
                `<li>${produto.nome} - ${produto.preco}</li>
                `).join('')
                }
            </ul>

            <a href="/produtos">Continuar Comprando</a>
            
        `);
    });

app.listen(3000, ()=>{console.log("Rodando")});