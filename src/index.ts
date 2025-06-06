import express from "express";
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.static(path.join(__dirname, 'dist/draw_board')));

let users: { [roomCode: string]: Set<string> } = {};


import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

import * as db from './db-connection';
let salas: {
    [roomCode: string]: {
        turnOrder: any[]
    }
} = {};

app.get('/player/:id', async (req, res) => {

    console.log(`Petición recibida al endpoint GET /player/${req.params.id}`);
    console.log(`Parametro recibido por URL: ${req.params.id}`);

    try {
        let query = `SELECT * FROM players WHERE id = '${req.params.id}'`;
        let db_response = await db.query(query);

        if (db_response.rows.length > 0) {
            console.log(`player encontrado:${db_response.rows[0].id}`);
            res.json(db_response.rows[0]);
        } else {
            console.log(`Player no encontrado`);
            res.json(`Player not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/player/', jsonParser, async (req, res) => {
    console.log(`Petición recibida al endpoint POST /player/`);
    console.log(`Cuerpo recibido:`, req.body);

    let playerinfo = req.body;

    try {
        let queryPlayer = `
            INSERT INTO players (id, name, health_points, mana_points, strength, magical_damage, defense, critical_chance, critical_damage, experience, level, currency)
            VALUES ('${playerinfo.id}', '${playerinfo.name}', ${playerinfo.health_points}, ${playerinfo.mana_points}, ${playerinfo.strength}, ${playerinfo.magical_damage}, ${playerinfo.defense}, ${playerinfo.critical_chance}, ${playerinfo.critical_damage}, ${playerinfo.experience}, ${playerinfo.level}, ${playerinfo.currency});
        `;

        let db_response_player = await db.query(queryPlayer);

        if (db_response_player.rowCount === 1) {
            let queryProgress = `
                INSERT INTO progress (player_id, current_stage, enemy_boost, enemies_defeated)
                VALUES ('${playerinfo.id}', 1, 0, 0);
            `;

            let db_response_progress = await db.query(queryProgress);

            if (db_response_progress.rowCount === 1) {
                res.json(`Jugador y progreso creados correctamente.`);
            } else {
                res.json(`Jugador creado, pero no se pudo crear el progreso.`);
            }
        } else {
            res.json(`El jugador NO ha sido creado.`);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/player/:id/progress', async (req, res) => {

    console.log(`Petición recibida al endpoint GET /player/${req.params.id}`);
    console.log(`Parametro recibido por URL: ${req.params.id}`);

    try {
        let query = `SELECT * FROM progress WHERE player_id = '${req.params.id}'`;
        let db_response = await db.query(query);

        if (db_response.rows.length > 0) {
            console.log(`player encontrado:${db_response.rows[0].id}`);
            res.json(db_response.rows[0]);
        } else {
            console.log(`Player no encontrado`);
            res.json(`Player not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/player/:id/stats', async (req, res) => {
    let playerId = req.params.id;
    console.log(`Petición recibida a /player/${playerId}/stats`);

    try {
        let playerQuery = `SELECT * FROM players WHERE id = '${playerId}'`;
        let playerResult = await db.query(playerQuery);

        if (playerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        let player = playerResult.rows[0];

        let gearQuery = `SELECT * FROM gear WHERE id = '${playerId}'`;
        let gearResult = await db.query(gearQuery);
        let gear = gearResult.rows[0];

        let itemIds: number[] = [];

        if (gear) {
            for (let key in gear) {
                if (key !== 'id' && gear[key]) {
                    itemIds.push(gear[key]);
                }
            }
        }

        let items: any[] = [];

        if (itemIds.length > 0) {
            let itemsQuery = `SELECT * FROM items WHERE id IN (${itemIds.join(',')})`;
            let itemsResult = await db.query(itemsQuery);
            items = itemsResult.rows;
        }

        let totalStats = {
            id: player.id,
            name: player.name,
            health_points: player.health_points,
            mana_points: player.mana_points,
            strength: player.strength,
            magical_damage: player.magical_damage,
            defense: player.defense,
            critical_chance: player.critical_chance,
            critical_damage: player.critical_damage,
            experience: player.experience,
            level: player.level,
            currency: player.currency
        };

        for (let item of items) {
            totalStats.health_points += item.health_points;
            totalStats.mana_points += item.mana_points;
            totalStats.strength += item.strength;
            totalStats.magical_damage += item.magical_damage;
            totalStats.defense += item.defense;
            totalStats.critical_chance += item.critical_chance;
            totalStats.critical_damage += item.critical_damage;
        }

        res.json(totalStats);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



function shuffleArray(arr: any[]) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
io.on('connection', (socket: any) => {

    socket.on('disconnect', () => {
        let roomCode = socket.data.room_code;
        let username = socket.data.username;

        if (salas[roomCode]) {
            salas[roomCode].turnOrder = salas[roomCode].turnOrder.filter(
                entry => entry.nombre !== username
            );

            io.to(roomCode).emit('set_turn_order', salas[roomCode].turnOrder);
        }

        if (username && roomCode && users[roomCode]) {
            users[roomCode].delete(username);

            if (users[roomCode].size === 0) {
                delete users[roomCode];
            } else {
                let newLeader = Array.from(users[roomCode])[0];
                io.to(roomCode).emit('leader_' + roomCode, newLeader);
            }

            if (users[roomCode]) {
                io.emit('user_list_' + roomCode, Array.from(users[roomCode]));
            }

            io.emit('user left', username);
        }

    });

    socket.on('join_room', (info: any) => {
        socket.join(`${info.code}`)
        console.log(`User ${info.username} joined room ${info.code}`);
        console.log(info)
        socket.data.username = info.username;
        socket.data.room_code = info.code
        socket.data.email = info.email

        if (!users[info.code]) {
            users[info.code] = new Set()
        }

        if (users[info.code].size >= 5) {
            socket.emit('room_full', { message: 'La sala ya tiene 5 jugadores.' });
            return;
        }

        users[info.code].add(info.username)

        let leader = Array.from(users[info.code])[0];

        io.to(`${info.code}`).emit('leader_' + info.code, leader);
        console.log(`Nuevo líder de la sala ${info.code}: ${leader}`);

        io.emit('user_list_' + info.code, Array.from(users[info.code]));
        console.log(users)

    })

    socket.on('expulsar_jugador', (data: any) => {
        let room = data.room;
        let username = data.user;

        if (users[room] && users[room].has(username)) {
            users[room].delete(username);
            console.log(`Usuario ${username} expulsado de la sala ${room}`);

            io.to(`${room}`).emit('user_list_' + room, Array.from(users[room]));
            io.to(`${room}`).emit('user_expulsado', { user: username, room: room });

        } else {
            console.warn(`No se pudo expulsar: sala ${room} o usuario ${username} no existen.`);
            socket.emit('error_message', { message: 'No se pudo expulsar al usuario.' });
        }
    });


    socket.on('start_game', (data: any) => {
        let room = data.room;
        let username = socket.data.username;

        let usersInRoom = Array.from(users[room] || []);
        let leader = usersInRoom[0];
        console.log(`Usuario ${username} intenta iniciar la partida en la sala ${room}`);
        if (username === leader) {
            io.to(`${room}`).emit('start_game_' + room);
            console.log(`Partida iniciada por el líder ${username}`);
        } else {
            console.warn(`Usuario ${username} intentó iniciar partida, pero no es el líder.`);
            socket.emit('error_message', { message: 'Solo el líder puede iniciar la partida.' });
        }
    });

    socket.on('get_room_players', (roomCode: number) => {
        if (users[roomCode]) {

            let playerData = Array.from(users[roomCode]).map((username) => {
                let playerSocket = Array.from(io.sockets.sockets.values()).find(s => s.data.username === username && s.data.room_code === roomCode);
                return {
                    username,
                    email: playerSocket?.data.email || null
                };
            });

            let uniquePlayers = Array.from(new Map(playerData.map(player1 => [player1.email, player1])).values());

            socket.emit('room_players_data', uniquePlayers);
        } else {
            socket.emit('room_players_data', []);
        }
    });

    socket.on('start_round', (roomCode: any) => {
        if (!users[roomCode]) return;

        let playersInRoom = Array.from(users[roomCode]);

        let playerData = playersInRoom.map(username => {
            let playerSocket = Array.from(io.sockets.sockets.values())
                .find(s => s.data.username === username && s.data.room_code === roomCode);

            return {
                tipo: 'jugador',
                email: playerSocket?.data.email || null,
                nombre: username
            };
        });

        let enemigo = {
            tipo: 'enemigo',
            nombre: 'Enemigo'
        };

        let turnOrder = shuffleArray([playerData, enemigo]);

        if (!salas[roomCode]) salas[roomCode] = { turnOrder: [] };
        salas[roomCode].turnOrder = turnOrder;

        io.to(roomCode).emit('set_turn_order', turnOrder);
    });


});


const port = process.env.PORT || 3000;

server.listen(port, () =>
    console.log(`App listening on PORT ${port}.

    ENDPOINTS:
    
     - GET /player/:id

     - POST /player/

     `));