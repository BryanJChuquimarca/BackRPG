"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
app.use(cors_1.default());
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist/draw_board')));
var users = {};
var body_parser_1 = __importDefault(require("body-parser"));
var jsonParser = body_parser_1.default.json();
var db = __importStar(require("./db-connection"));
var salas = {};
app.get('/player/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /player/" + req.params.id);
                console.log("Parametro recibido por URL: " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM players WHERE id = '" + req.params.id + "'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("player encontrado:" + db_response.rows[0].id);
                    res.json(db_response.rows[0]);
                }
                else {
                    console.log("Player no encontrado");
                    res.json("Player not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/player/', jsonParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playerinfo, queryPlayer, db_response_player, queryProgress, db_response_progress, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint POST /player/");
                console.log("Cuerpo recibido:", req.body);
                playerinfo = req.body;
                console.log(playerinfo);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                queryPlayer = "\n            INSERT INTO players (id, name, health_points, mana_points, strength, magical_damage, defense, critical_chance, critical_damage, experience, level, currency, class)\n            VALUES ('" + playerinfo.id + "', '" + playerinfo.name + "', " + playerinfo.health_points + ", " + playerinfo.mana_points + ", " + playerinfo.strength + ", " + playerinfo.magical_damage + ", " + playerinfo.defense + ", " + playerinfo.critical_chance + ", " + playerinfo.critical_damage + ", " + playerinfo.experience + ", " + playerinfo.level + ", " + playerinfo.currency + ", '" + playerinfo.class + "');\n        ";
                return [4 /*yield*/, db.query(queryPlayer)];
            case 2:
                db_response_player = _a.sent();
                if (!(db_response_player.rowCount === 1)) return [3 /*break*/, 4];
                queryProgress = "\n                INSERT INTO progress (player_id, current_stage, enemy_boost, enemies_defeated)\n                VALUES ('" + playerinfo.id + "', 1, 0, 0);\n            ";
                return [4 /*yield*/, db.query(queryProgress)];
            case 3:
                db_response_progress = _a.sent();
                if (db_response_progress.rowCount === 1) {
                    res.json("Jugador y progreso creados correctamente.");
                }
                else {
                    res.json("Jugador creado, pero no se pudo crear el progreso.");
                }
                return [3 /*break*/, 5];
            case 4:
                res.json("El jugador NO ha sido creado.");
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_2 = _a.sent();
                console.error(err_2);
                res.status(500).send('Error interno del servidor');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get('/enemies/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /player/" + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM enemies WHERE id = '" + req.params.id + "' ORDER BY id ASC";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("enemigo encontrado:" + db_response.rows[0].id);
                    res.json(db_response.rows[0]);
                }
                else {
                    console.log("enemigo no encontrado");
                    res.json("enemigo not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error(err_3);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/player/:id/progress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Petici\u00F3n recibida al endpoint GET /player/" + req.params.id);
                console.log("Parametro recibido por URL: " + req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM progress WHERE player_id = '" + req.params.id + "'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("player encontrado:" + db_response.rows[0].id);
                    res.json(db_response.rows[0]);
                }
                else {
                    console.log("Player no encontrado");
                    res.json("Player not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/player/:id/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, playerQuery, playerResult, player, gearQuery, gearResult, gear, itemIds, key, items, itemsQuery, itemsResult, totalStats, _i, items_1, item, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                playerId = req.params.id;
                console.log("Petici\u00F3n recibida a /player/" + playerId + "/stats");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                playerQuery = "SELECT * FROM players WHERE id = '" + playerId + "'";
                return [4 /*yield*/, db.query(playerQuery)];
            case 2:
                playerResult = _a.sent();
                if (playerResult.rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Player not found' })];
                }
                player = playerResult.rows[0];
                gearQuery = "SELECT * FROM gear WHERE id = '" + playerId + "'";
                return [4 /*yield*/, db.query(gearQuery)];
            case 3:
                gearResult = _a.sent();
                gear = gearResult.rows[0];
                itemIds = [];
                if (gear) {
                    for (key in gear) {
                        if (key !== 'id' && gear[key]) {
                            itemIds.push(gear[key]);
                        }
                    }
                }
                items = [];
                if (!(itemIds.length > 0)) return [3 /*break*/, 5];
                itemsQuery = "SELECT * FROM items WHERE id IN (" + itemIds.join(',') + ")";
                return [4 /*yield*/, db.query(itemsQuery)];
            case 4:
                itemsResult = _a.sent();
                items = itemsResult.rows;
                _a.label = 5;
            case 5:
                totalStats = {
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
                    class: player.class,
                    level: player.level,
                    currency: player.currency
                };
                for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                    item = items_1[_i];
                    totalStats.health_points += item.health_points;
                    totalStats.mana_points += item.mana_points;
                    totalStats.strength += item.strength;
                    totalStats.magical_damage += item.magical_damage;
                    totalStats.defense += item.defense;
                    totalStats.critical_chance += item.critical_chance;
                    totalStats.critical_damage += item.critical_damage;
                }
                res.json(totalStats);
                return [3 /*break*/, 7];
            case 6:
                err_5 = _a.sent();
                console.error(err_5);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
function shuffleArray(arr) {
    var _a;
    var copy = __spreadArrays(arr);
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [copy[j], copy[i]], copy[i] = _a[0], copy[j] = _a[1];
    }
    return copy;
}
var readyPlayers = {};
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        var roomCode = socket.data.room_code;
        var username = socket.data.username;
        if (salas[roomCode]) {
            salas[roomCode].turnOrder = salas[roomCode].turnOrder.filter(function (entry) { return entry.nombre !== username; });
            io.to(roomCode).emit('set_turn_order', salas[roomCode].turnOrder);
        }
        if (username && roomCode && users[roomCode]) {
            users[roomCode].delete(username);
            if (users[roomCode].size === 0) {
                delete users[roomCode];
            }
            else {
                var newLeader = Array.from(users[roomCode])[0];
                io.to(roomCode).emit('leader_' + roomCode, newLeader);
            }
            if (users[roomCode]) {
                io.emit('user_list_' + roomCode, Array.from(users[roomCode]));
            }
            io.emit('user left', username);
        }
    });
    socket.on('join_room', function (info) {
        socket.join("" + info.code);
        console.log("User " + info.username + " joined room " + info.code);
        console.log(info);
        socket.data.username = info.username;
        socket.data.room_code = info.code;
        socket.data.email = info.email;
        if (!users[info.code]) {
            users[info.code] = new Set();
        }
        if (users[info.code].size >= 5) {
            socket.emit('room_full', { message: 'La sala ya tiene 5 jugadores.' });
            return;
        }
        users[info.code].add(info.username);
        var leader = Array.from(users[info.code])[0];
        io.to("" + info.code).emit('leader_' + info.code, leader);
        console.log("Nuevo l\u00EDder de la sala " + info.code + ": " + leader);
        io.emit('user_list_' + info.code, Array.from(users[info.code]));
        console.log(users);
    });
    socket.on('expulsar_jugador', function (data) {
        var room = data.room;
        var username = data.user;
        if (users[room] && users[room].has(username)) {
            users[room].delete(username);
            console.log("Usuario " + username + " expulsado de la sala " + room);
            io.to("" + room).emit('user_list_' + room, Array.from(users[room]));
            io.to("" + room).emit('user_expulsado', { user: username, room: room });
        }
        else {
            console.warn("No se pudo expulsar: sala " + room + " o usuario " + username + " no existen.");
            socket.emit('error_message', { message: 'No se pudo expulsar al usuario.' });
        }
    });
    socket.on('start_game', function (data) {
        var room = data.room;
        var username = socket.data.username;
        var usersInRoom = Array.from(users[room] || []);
        var leader = usersInRoom[0];
        console.log("Usuario " + username + " intenta iniciar la partida en la sala " + room);
        if (username === leader) {
            io.to("" + room).emit('start_game_' + room);
            console.log("Partida iniciada por el l\u00EDder " + username);
        }
        else {
            console.warn("Usuario " + username + " intent\u00F3 iniciar partida, pero no es el l\u00EDder.");
            socket.emit('error_message', { message: 'Solo el líder puede iniciar la partida.' });
        }
    });
    socket.on('get_room_players', function (roomCode) {
        if (users[roomCode]) {
            var playerData = Array.from(users[roomCode]).map(function (username) {
                var playerSocket = Array.from(io.sockets.sockets.values()).find(function (s) { return s.data.username === username && s.data.room_code === roomCode; });
                return {
                    username: username,
                    email: (playerSocket === null || playerSocket === void 0 ? void 0 : playerSocket.data.email) || null
                };
            });
            var uniquePlayers = Array.from(new Map(playerData.map(function (player1) { return [player1.email, player1]; })).values());
            socket.emit('room_players_data', uniquePlayers);
        }
        else {
            socket.emit('room_players_data', []);
        }
    });
    socket.on('start_round', function (roomCode) {
        if (!users[roomCode])
            return;
        var playersInRoom = Array.from(users[roomCode]);
        var playerData = playersInRoom.map(function (username) {
            var playerSocket = Array.from(io.sockets.sockets.values())
                .find(function (s) { return s.data.username === username && s.data.room_code === roomCode; });
            return {
                tipo: 'jugador',
                email: (playerSocket === null || playerSocket === void 0 ? void 0 : playerSocket.data.email) || null,
                nombre: username
            };
        });
        var enemigo = {
            tipo: 'enemigo',
            nombre: 'Enemigo'
        };
        var turnOrder = shuffleArray([playerData, enemigo]);
        if (!salas[roomCode])
            salas[roomCode] = { turnOrder: [] };
        salas[roomCode].turnOrder = turnOrder;
        io.to(roomCode).emit('set_turn_order', turnOrder);
    });
    socket.on('enemigos_seleccionados', function (roomCode, enemy) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("\uD83D\uDCE3 Enemigos seleccionados por el l\u00EDder de la sala " + roomCode + ":", enemy);
            io.to("" + roomCode).emit("enemigossala" + roomCode, enemy);
            return [2 /*return*/];
        });
    }); });
});
var port = process.env.PORT || 3000;
server.listen(port, function () {
    return console.log("App listening on PORT " + port + ".\n\n    ENDPOINTS:\n    \n     - GET /player/:id\n\n     - POST /player/\n\n     ");
});
