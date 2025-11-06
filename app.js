/*
 * Indie Game Jam Manager - Main Application
 * CS340 Group 17 - Rehjii Martin & Jonah Sutch
 */

/*
    SETUP
*/

// Express
const express = require('express');   // We are using the express library for the web server
const app = express();                // We need to instantiate an express object to interact with the server in our code
const PORT = 9124;                    // Set a port number at the top so it's easy to change

// Handlebars setup
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        eq: function(a, b) { return a === b; }
    }
}));
app.set('view engine', '.hbs');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database
const db = require('./database/db-connector');

/*
 * ROUTES - Home/Index
 */
app.get('/', function(req, res) {
    res.render('index', { title: 'Indie Game Jam Manager' });
});

/*
 * ROUTES - Jams
 */
// Browse Jams
app.get('/jams', function(req, res) {
    const query = "SELECT jamID, jamName, startDate, endDate, location, maxTeamSize, createdAt FROM Jams ORDER BY startDate DESC;";

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('jams', { data: rows, title: 'Game Jams' });
    });
});

// Add Jam page
app.get('/jams/add', function(req, res) {
    res.render('jams-add', { title: 'Add New Game Jam' });
});

// Update Jam page
app.get('/jams/update/:id', function(req, res) {
    const query = "SELECT * FROM Jams WHERE jamID = ?;";

    db.pool.query(query, [req.params.id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('jams-update', { jam: rows[0], title: 'Update Game Jam' });
    });
});

/*
 * ROUTES - Participants
 */
// Browse Participants
app.get('/participants', function(req, res) {
    const query = "SELECT participantID, firstName, lastName, email, handle, skills FROM Participants ORDER BY lastName, firstName;";

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('participants', { data: rows, title: 'Participants' });
    });
});

// Add Participant page
app.get('/participants/add', function(req, res) {
    res.render('participants-add', { title: 'Add New Participant' });
});

// Update Participant page
app.get('/participants/update/:id', function(req, res) {
    const query = "SELECT * FROM Participants WHERE participantID = ?;";

    db.pool.query(query, [req.params.id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('participants-update', { participant: rows[0], title: 'Update Participant' });
    });
});

/*
 * ROUTES - Teams
 */
// Browse Teams
app.get('/teams', function(req, res) {
    const query = `
        SELECT t.teamID, t.teamName, j.jamName, t.createdAt, j.jamID
        FROM Teams t
        INNER JOIN Jams j ON t.jamID = j.jamID
        ORDER BY t.createdAt DESC;
    `;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('teams', { data: rows, title: 'Teams' });
    });
});

// Add Team page
app.get('/teams/add', function(req, res) {
    const query = "SELECT jamID, jamName FROM Jams ORDER BY startDate DESC;";

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('teams-add', { jams: rows, title: 'Add New Team' });
    });
});

// Update Team page
app.get('/teams/update/:id', function(req, res) {
    const teamQuery = "SELECT * FROM Teams WHERE teamID = ?;";
    const jamsQuery = "SELECT jamID, jamName FROM Jams ORDER BY startDate DESC;";

    db.pool.query(teamQuery, [req.params.id], function(error, teamRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        db.pool.query(jamsQuery, function(error, jamRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            res.render('teams-update', { team: teamRows[0], jams: jamRows, title: 'Update Team' });
        });
    });
});

/*
 * ROUTES - Games
 */
// Browse Games
app.get('/games', function(req, res) {
    const query = `
        SELECT g.gameID, g.gameTitle, g.engine, g.genre, g.submissionURL,
               g.status, g.score, j.jamName, j.jamID
        FROM Games g
        INNER JOIN Jams j ON g.jamID = j.jamID
        ORDER BY g.gameTitle;
    `;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('games', { data: rows, title: 'Games' });
    });
});

// Add Game page
app.get('/games/add', function(req, res) {
    const query = "SELECT jamID, jamName FROM Jams ORDER BY startDate DESC;";

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('games-add', { jams: rows, title: 'Add New Game' });
    });
});

// Update Game page
app.get('/games/update/:id', function(req, res) {
    const gameQuery = "SELECT * FROM Games WHERE gameID = ?;";
    const jamsQuery = "SELECT jamID, jamName FROM Jams ORDER BY startDate DESC;";

    db.pool.query(gameQuery, [req.params.id], function(error, gameRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        db.pool.query(jamsQuery, function(error, jamRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            res.render('games-update', { game: gameRows[0], jams: jamRows, title: 'Update Game' });
        });
    });
});

/*
 * ROUTES - Tools
 */
// Browse Tools
app.get('/tools', function(req, res) {
    const query = "SELECT toolID, toolName, toolType, sourceURL FROM Tools ORDER BY toolName;";

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('tools', { data: rows, title: 'Tools' });
    });
});

// Add Tool page
app.get('/tools/add', function(req, res) {
    res.render('tools-add', { title: 'Add New Tool' });
});

// Update Tool page
app.get('/tools/update/:id', function(req, res) {
    const query = "SELECT * FROM Tools WHERE toolID = ?;";

    db.pool.query(query, [req.params.id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('tools-update', { tool: rows[0], title: 'Update Tool' });
    });
});

/*
 * ROUTES - GameParticipants (M:N Relationship)
 */
// Browse Game Participants
app.get('/game-participants', function(req, res) {
    const query = `
        SELECT gp.gameParticipantID, g.gameTitle, g.gameID,
               CONCAT(p.firstName, ' ', p.lastName) AS participantName,
               p.participantID, gp.role
        FROM GameParticipants gp
        INNER JOIN Games g ON gp.gameID = g.gameID
        INNER JOIN Participants p ON gp.participantID = p.participantID
        ORDER BY g.gameTitle, p.lastName;
    `;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('game-participants', { data: rows, title: 'Game Participants' });
    });
});

// Add Game Participant page
app.get('/game-participants/add', function(req, res) {
    const gamesQuery = "SELECT gameID, gameTitle FROM Games ORDER BY gameTitle;";
    const participantsQuery = "SELECT participantID, firstName, lastName FROM Participants ORDER BY lastName, firstName;";

    db.pool.query(gamesQuery, function(error, gameRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        db.pool.query(participantsQuery, function(error, participantRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            res.render('game-participants-add', {
                games: gameRows,
                participants: participantRows,
                title: 'Add Game Participant'
            });
        });
    });
});

// Update Game Participant page
app.get('/game-participants/update/:id', function(req, res) {
    const gpQuery = "SELECT * FROM GameParticipants WHERE gameParticipantID = ?;";
    const gamesQuery = "SELECT gameID, gameTitle FROM Games ORDER BY gameTitle;";
    const participantsQuery = "SELECT participantID, firstName, lastName FROM Participants ORDER BY lastName, firstName;";

    db.pool.query(gpQuery, [req.params.id], function(error, gpRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        db.pool.query(gamesQuery, function(error, gameRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            db.pool.query(participantsQuery, function(error, participantRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                    return;
                }
                res.render('game-participants-update', {
                    gameParticipant: gpRows[0],
                    games: gameRows,
                    participants: participantRows,
                    title: 'Update Game Participant'
                });
            });
        });
    });
});

/*
 * ROUTES - GameTools (M:N Relationship)
 */
// Browse Game Tools
app.get('/game-tools', function(req, res) {
    const query = `
        SELECT gt.gameToolID, g.gameTitle, g.gameID, t.toolName,
               t.toolID, gt.notes
        FROM GameTools gt
        INNER JOIN Games g ON gt.gameID = g.gameID
        INNER JOIN Tools t ON gt.toolID = t.toolID
        ORDER BY g.gameTitle, t.toolName;
    `;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.render('game-tools', { data: rows, title: 'Game Tools' });
    });
});

// Add Game Tool page
app.get('/game-tools/add', function(req, res) {
    const gamesQuery = "SELECT gameID, gameTitle FROM Games ORDER BY gameTitle;";
    const toolsQuery = "SELECT toolID, toolName FROM Tools ORDER BY toolName;";

    db.pool.query(gamesQuery, function(error, gameRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        db.pool.query(toolsQuery, function(error, toolRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            res.render('game-tools-add', {
                games: gameRows,
                tools: toolRows,
                title: 'Add Game Tool'
            });
        });
    });
});

// Update Game Tool page
app.get('/game-tools/update/:id', function(req, res) {
    const gtQuery = "SELECT * FROM GameTools WHERE gameToolID = ?;";
    const gamesQuery = "SELECT gameID, gameTitle FROM Games ORDER BY gameTitle;";
    const toolsQuery = "SELECT toolID, toolName FROM Tools ORDER BY toolName;";

    db.pool.query(gtQuery, [req.params.id], function(error, gtRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }

        db.pool.query(gamesQuery, function(error, gameRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }

            db.pool.query(toolsQuery, function(error, toolRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                    return;
                }
                res.render('game-tools-update', {
                    gameTool: gtRows[0],
                    games: gameRows,
                    tools: toolRows,
                    title: 'Update Game Tool'
                });
            });
        });
    });
});

/*
 * LISTENER
 */
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
