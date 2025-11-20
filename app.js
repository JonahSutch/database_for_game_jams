/*
 * Indie Game Jam Manager - Main Application
 * CS340 Group 73 - Rehjii Martin & Jonah Sutch
 */

/*
    SETUP
*/

// Express
const express = require('express');   // We are using the express library for the web server
const app = express();                // We need to instantiate an express object to interact with the server in our code
const PORT = 3397;                    // Set a port number at the top so it's easy to change

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
 * POST ROUTES - CREATE Operations
 */

// Add new Jam
app.post('/jams/add', function(req, res) {
    const query = "INSERT INTO Jams (jamName, startDate, endDate, location, maxTeamSize) VALUES (?, ?, ?, ?, ?);";
    const values = [
        req.body.jamName,
        req.body.startDate,
        req.body.endDate,
        req.body.location || null,
        parseInt(req.body.maxTeamSize)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/jams');
    });
});

// Add new Participant
app.post('/participants/add', function(req, res) {
    const query = "INSERT INTO Participants (firstName, lastName, email, handle, skills) VALUES (?, ?, ?, ?, ?);";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.handle || null,
        req.body.skills || null
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/participants');
    });
});

// Add new Team
app.post('/teams/add', function(req, res) {
    const query = "INSERT INTO Teams (teamName, jamID) VALUES (?, ?);";
    const values = [
        req.body.teamName,
        parseInt(req.body.jamID)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/teams');
    });
});

// Add new Game
app.post('/games/add', function(req, res) {
    const query = "INSERT INTO Games (jamID, gameTitle, engine, genre, submissionURL, status, score) VALUES (?, ?, ?, ?, ?, ?, ?);";
    const values = [
        parseInt(req.body.jamID),
        req.body.gameTitle,
        req.body.engine || null,
        req.body.genre || null,
        req.body.submissionURL || null,
        req.body.status || 'Submitted',
        req.body.score ? parseFloat(req.body.score) : null
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/games');
    });
});

// Add new Tool
app.post('/tools/add', function(req, res) {
    const query = "INSERT INTO Tools (toolName, toolType, sourceURL) VALUES (?, ?, ?);";
    const values = [
        req.body.toolName,
        req.body.toolType || null,
        req.body.sourceURL || null
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/tools');
    });
});

// Add new Game Participant
app.post('/game-participants/add', function(req, res) {
    const query = "INSERT INTO GameParticipants (gameID, participantID, role) VALUES (?, ?, ?);";
    const values = [
        parseInt(req.body.gameID),
        parseInt(req.body.participantID),
        req.body.role
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/game-participants');
    });
});

// Add new Game Tool
app.post('/game-tools/add', function(req, res) {
    const query = "INSERT INTO GameTools (gameID, toolID, notes) VALUES (?, ?, ?);";
    const values = [
        parseInt(req.body.gameID),
        parseInt(req.body.toolID),
        req.body.notes || null
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/game-tools');
    });
});

/*
 * POST ROUTES - UPDATE Operations
 */

// Update Jam
app.post('/jams/update/:id', function(req, res) {
    const query = "UPDATE Jams SET jamName = ?, startDate = ?, endDate = ?, location = ?, maxTeamSize = ? WHERE jamID = ?;";
    const values = [
        req.body.jamName,
        req.body.startDate,
        req.body.endDate,
        req.body.location || null,
        parseInt(req.body.maxTeamSize),
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/jams');
    });
});

// Update Participant
app.post('/participants/update/:id', function(req, res) {
    const query = "UPDATE Participants SET firstName = ?, lastName = ?, email = ?, handle = ?, skills = ? WHERE participantID = ?;";
    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.handle || null,
        req.body.skills || null,
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/participants');
    });
});

// Update Team
app.post('/teams/update/:id', function(req, res) {
    const query = "UPDATE Teams SET teamName = ?, jamID = ? WHERE teamID = ?;";
    const values = [
        req.body.teamName,
        parseInt(req.body.jamID),
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/teams');
    });
});

// Update Game
app.post('/games/update/:id', function(req, res) {
    const query = "UPDATE Games SET jamID = ?, gameTitle = ?, engine = ?, genre = ?, submissionURL = ?, status = ?, score = ? WHERE gameID = ?;";
    const values = [
        parseInt(req.body.jamID),
        req.body.gameTitle,
        req.body.engine || null,
        req.body.genre || null,
        req.body.submissionURL || null,
        req.body.status || 'Submitted',
        req.body.score ? parseFloat(req.body.score) : null,
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/games');
    });
});

// Update Tool
app.post('/tools/update/:id', function(req, res) {
    const query = "UPDATE Tools SET toolName = ?, toolType = ?, sourceURL = ? WHERE toolID = ?;";
    const values = [
        req.body.toolName,
        req.body.toolType || null,
        req.body.sourceURL || null,
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/tools');
    });
});

// Update Game Participant
app.post('/game-participants/update/:id', function(req, res) {
    const query = "UPDATE GameParticipants SET gameID = ?, participantID = ?, role = ? WHERE gameParticipantID = ?;";
    const values = [
        parseInt(req.body.gameID),
        parseInt(req.body.participantID),
        req.body.role,
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/game-participants');
    });
});

// Update Game Tool
app.post('/game-tools/update/:id', function(req, res) {
    const query = "UPDATE GameTools SET gameID = ?, toolID = ?, notes = ? WHERE gameToolID = ?;";
    const values = [
        parseInt(req.body.gameID),
        parseInt(req.body.toolID),
        req.body.notes || null,
        parseInt(req.params.id)
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        res.redirect('/game-tools');
    });
});

/*
 * DELETE ROUTES
 */

// Delete Jam
app.delete('/jams/delete/:id', function(req, res) {
    const query = "DELETE FROM Jams WHERE jamID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete jam' });
            return;
        }
        res.status(204).send();
    });
});

// Delete Participant
app.delete('/participants/delete/:id', function(req, res) {
    const query = "DELETE FROM Participants WHERE participantID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete participant' });
            return;
        }
        res.status(204).send();
    });
});

// Delete Team
app.delete('/teams/delete/:id', function(req, res) {
    const query = "DELETE FROM Teams WHERE teamID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete team' });
            return;
        }
        res.status(204).send();
    });
});

// Delete Game
app.delete('/games/delete/:id', function(req, res) {
    const query = "DELETE FROM Games WHERE gameID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete game' });
            return;
        }
        res.status(204).send();
    });
});

// Delete Tool
app.delete('/tools/delete/:id', function(req, res) {
    const query = "DELETE FROM Tools WHERE toolID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete tool' });
            return;
        }
        res.status(204).send();
    });
});

// Delete Game Participant
app.delete('/game-participants/delete/:id', function(req, res) {
    const query = "DELETE FROM GameParticipants WHERE gameParticipantID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete game participant' });
            return;
        }
        res.status(204).send();
    });
});

// Delete Game Tool
app.delete('/game-tools/delete/:id', function(req, res) {
    const query = "DELETE FROM GameTools WHERE gameToolID = ?;";

    db.pool.query(query, [parseInt(req.params.id)], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to delete game tool' });
            return;
        }
        res.status(204).send();
    });
});

/*
 * RESET DATABASE ROUTE
 */
app.post('/reset-database', function(req, res) {
    // Call the stored procedure to reset the database
    const query = "CALL ResetDatabase();";

    db.pool.query(query, function(error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Failed to reset database',
                error: error.message
            });
            return;
        }
        res.json({
            success: true,
            message: 'Database reset successfully!'
        });
    });
});

/*
 * LISTENER
 */
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
