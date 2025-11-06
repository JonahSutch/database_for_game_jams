-- Indie Game Jam Manager (IGJM)
-- CS340 Step 2 Draft / Group 17
-- Rehjii Martin & Jonah Sutch

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

DROP TABLE IF EXISTS GameTools;
DROP TABLE IF EXISTS GameParticipants;
DROP TABLE IF EXISTS Tools;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Teams;
DROP TABLE IF EXISTS Participants;
DROP TABLE IF EXISTS Jams;

-- Table: Jams
CREATE TABLE Jams (
    jamID INT AUTO_INCREMENT PRIMARY KEY,
    jamName VARCHAR(150) UNIQUE NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    location VARCHAR(120),
    maxTeamSize INT NOT NULL DEFAULT 5,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Participants
CREATE TABLE Participants (
    participantID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(80) NOT NULL,
    lastName VARCHAR(80) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    handle VARCHAR(60),
    skills VARCHAR(250)
);

-- Table: Teams
CREATE TABLE Teams (
    teamID INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(120) NOT NULL,
    jamID INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jamID) REFERENCES Jams(jamID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Table: Games
CREATE TABLE Games (
    gameID INT AUTO_INCREMENT PRIMARY KEY,
    jamID INT NOT NULL,
    gameTitle VARCHAR(150) NOT NULL,
    engine VARCHAR(80),
    genre VARCHAR(80),
    submissionURL VARCHAR(255),
    status ENUM('Submitted','Approved','Rejected') DEFAULT 'Submitted',
    score DECIMAL(5,2),
    FOREIGN KEY (jamID) REFERENCES Jams(jamID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Table: Tools
CREATE TABLE Tools (
    toolID INT AUTO_INCREMENT PRIMARY KEY,
    toolName VARCHAR(120) NOT NULL,
    toolType VARCHAR(80),
    sourceURL VARCHAR(255)
);


-- Table: GameParticipants (M:N)
CREATE TABLE GameParticipants (
    gameParticipantID INT AUTO_INCREMENT PRIMARY KEY,
    gameID INT NOT NULL,
    participantID INT NOT NULL,
    role VARCHAR(80) NOT NULL,
    UNIQUE (gameID, participantID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (participantID) REFERENCES Participants(participantID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Table: GameTools (M:N)
CREATE TABLE GameTools (
    gameToolID INT AUTO_INCREMENT PRIMARY KEY,
    gameID INT NOT NULL,
    toolID INT NOT NULL,
    notes VARCHAR(255),
    UNIQUE (gameID, toolID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (toolID) REFERENCES Tools(toolID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Sample data INSERTS

-- JAMS
INSERT INTO Jams (jamName, startDate, endDate, location, maxTeamSize)
VALUES
('Spring Jam 2026', '2026-03-01', '2026-03-03', 'Corvallis, OR', 5),
('Summer Online Jam', '2026-07-15', '2026-07-17', 'Online', 4),
('RetroJam 2026', '2026-09-05', '2026-09-06', 'Portland, OR', 6);

-- PARTICIPANTS
INSERT INTO Participants (firstName, lastName, email, handle, skills)
VALUES
('Alice', 'Rivera', 'alice@devmail.com', 'AliceR', '2D Art, UI Design'),
('Brandon', 'Yoon', 'brandon@devmail.com', 'CodeBY', 'Gameplay Programming'),
('Chen', 'Li', 'chen@devmail.com', 'LiDev', 'Sound Design, Mixing'),
('Dana', 'Patel', 'dana@devmail.com', 'DPat', '3D Modeling, Animation'),
('Evan', 'Singh', 'evan@devmail.com', 'EvSynth', 'Music Composition');

-- TEAMS
INSERT INTO Teams (teamName, jamID)
VALUES
('Pixel Pushers', 1),
('Code Crafters', 1),
('The Dreamers', 2),
('Retro Ninjas', 3);

-- GAMES
INSERT INTO Games (jamID, gameTitle, engine, genre, submissionURL, status, score)
VALUES
(1, 'Echoes of Light', 'Godot', 'Puzzle', 'https://example.com/echoes', 'Submitted', 8.7),
(1, 'Warp Drive', 'Unity', 'Racing', 'https://example.com/warp', 'Submitted', 9.3),
(2, 'Skyforge', 'Unreal', 'Action', 'https://example.com/skyforge', 'Submitted', 8.5),
(3, 'Chrono Run', 'Unity', 'Platformer', 'https://example.com/chrono', 'Submitted', 9.0),
(3, 'Pixel Relic', 'Godot', 'Adventure', 'https://example.com/pixelrelic', 'Submitted', 8.8);

-- TOOLS
INSERT INTO Tools (toolName, toolType, sourceURL)
VALUES
('Godot Engine', 'Game Engine', 'https://godotengine.org'),
('Unity', 'Game Engine', 'https://unity.com'),
('Unreal Engine', 'Game Engine', 'https://unrealengine.com'),
('Blender', '3D Modeling', 'https://blender.org'),
('FMOD Studio', 'Audio Middleware', 'https://fmod.com');

-- GAME PARTICIPANTS  (M:N)
INSERT INTO GameParticipants (gameID, participantID, role)
VALUES
(1, 1, 'Artist'),
(1, 2, 'Programmer'),
(2, 2, 'Programmer'),
(2, 3, 'Sound Designer'),
(3, 4, 'Modeler'),
(3, 5, 'Composer'),
(4, 1, 'Artist'),
(4, 2, 'Programmer'),
(5, 3, 'Sound Designer'),
(5, 4, 'Animator');

-- GAME TOOLS  (M:N)
INSERT INTO GameTools (gameID, toolID, notes)
VALUES
(1, 1, 'Primary engine'),
(1, 4, 'Asset modeling'),
(2, 2, 'Main engine'),
(2, 5, 'Audio effects'),
(3, 3, 'Main engine'),
(3, 5, 'Soundtrack mixing'),
(4, 2, 'Main engine'),
(4, 4, 'Environment assets'),
(5, 1, 'Core engine'),
(5, 4, 'Character modeling');


COMMIT;
SET FOREIGN_KEY_CHECKS = 1;