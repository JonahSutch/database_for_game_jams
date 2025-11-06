-- Indie Game Jam Manager (IGJM)
-- Data Manipulation Queries (DML)
-- CS340 Step 3 - Group 73
-- Rehjii Martin & Jonah Sutch

-- NOTE: Variables are denoted using @ symbol (e.g., @jamName)
-- These will be replaced with actual values from the backend application


-- ============================================================================
-- JAMS QUERIES
-- ============================================================================

-- Get all Jams for the browse Jams page
SELECT jamID, jamName, startDate, endDate, location, maxTeamSize, createdAt
FROM Jams
ORDER BY startDate DESC;

-- Get a single Jam by ID for the update Jam form
SELECT jamID, jamName, startDate, endDate, location, maxTeamSize, createdAt
FROM Jams
WHERE jamID = @jamID_selected;

-- Add a new Jam
INSERT INTO Jams (jamName, startDate, endDate, location, maxTeamSize)
VALUES (@jamName_input, @startDate_input, @endDate_input, @location_input, @maxTeamSize_input);

-- Update a Jam
UPDATE Jams
SET jamName = @jamName_input,
    startDate = @startDate_input,
    endDate = @endDate_input,
    location = @location_input,
    maxTeamSize = @maxTeamSize_input
WHERE jamID = @jamID_selected;

-- Delete a Jam (will cascade delete Teams and Games due to ON DELETE CASCADE)
DELETE FROM Jams WHERE jamID = @jamID_selected;


-- ============================================================================
-- PARTICIPANTS QUERIES
-- ============================================================================

-- Get all Participants for the browse Participants page
SELECT participantID, firstName, lastName, email, handle, skills
FROM Participants
ORDER BY lastName, firstName;

-- Get a single Participant by ID for the update Participant form
SELECT participantID, firstName, lastName, email, handle, skills
FROM Participants
WHERE participantID = @participantID_selected;

-- Add a new Participant
INSERT INTO Participants (firstName, lastName, email, handle, skills)
VALUES (@firstName_input, @lastName_input, @email_input, @handle_input, @skills_input);

-- Update a Participant
UPDATE Participants
SET firstName = @firstName_input,
    lastName = @lastName_input,
    email = @email_input,
    handle = @handle_input,
    skills = @skills_input
WHERE participantID = @participantID_selected;

-- Delete a Participant (will cascade delete related GameParticipants)
DELETE FROM Participants WHERE participantID = @participantID_selected;


-- ============================================================================
-- TEAMS QUERIES
-- ============================================================================

-- Get all Teams with their associated Jam names for the browse Teams page
SELECT t.teamID, t.teamName, j.jamName, t.createdAt, j.jamID
FROM Teams t
INNER JOIN Jams j ON t.jamID = j.jamID
ORDER BY t.createdAt DESC;

-- Get a single Team by ID for the update Team form
SELECT teamID, teamName, jamID, createdAt
FROM Teams
WHERE teamID = @teamID_selected;

-- Get all Jams for dropdown menu (used in add/update Team forms)
SELECT jamID, jamName
FROM Jams
ORDER BY startDate DESC;

-- Add a new Team
INSERT INTO Teams (teamName, jamID)
VALUES (@teamName_input, @jamID_from_dropdown);

-- Update a Team
UPDATE Teams
SET teamName = @teamName_input,
    jamID = @jamID_from_dropdown
WHERE teamID = @teamID_selected;

-- Delete a Team
DELETE FROM Teams WHERE teamID = @teamID_selected;


-- ============================================================================
-- GAMES QUERIES
-- ============================================================================

-- Get all Games with their associated Jam names for the browse Games page
SELECT g.gameID, g.gameTitle, g.engine, g.genre, g.submissionURL,
       g.status, g.score, j.jamName, j.jamID
FROM Games g
INNER JOIN Jams j ON g.jamID = j.jamID
ORDER BY g.gameTitle;

-- Get a single Game by ID for the update Game form
SELECT gameID, jamID, gameTitle, engine, genre, submissionURL, status, score
FROM Games
WHERE gameID = @gameID_selected;

-- Get all Jams for dropdown menu (used in add/update Game forms)
SELECT jamID, jamName
FROM Jams
ORDER BY startDate DESC;

-- Add a new Game
INSERT INTO Games (jamID, gameTitle, engine, genre, submissionURL, status, score)
VALUES (@jamID_from_dropdown, @gameTitle_input, @engine_input, @genre_input,
        @submissionURL_input, @status_from_dropdown, @score_input);

-- Update a Game
UPDATE Games
SET jamID = @jamID_from_dropdown,
    gameTitle = @gameTitle_input,
    engine = @engine_input,
    genre = @genre_input,
    submissionURL = @submissionURL_input,
    status = @status_from_dropdown,
    score = @score_input
WHERE gameID = @gameID_selected;

-- Delete a Game (will cascade delete related GameParticipants and GameTools)
DELETE FROM Games WHERE gameID = @gameID_selected;


-- ============================================================================
-- TOOLS QUERIES
-- ============================================================================

-- Get all Tools for the browse Tools page
SELECT toolID, toolName, toolType, sourceURL
FROM Tools
ORDER BY toolName;

-- Get a single Tool by ID for the update Tool form
SELECT toolID, toolName, toolType, sourceURL
FROM Tools
WHERE toolID = @toolID_selected;

-- Add a new Tool
INSERT INTO Tools (toolName, toolType, sourceURL)
VALUES (@toolName_input, @toolType_input, @sourceURL_input);

-- Update a Tool
UPDATE Tools
SET toolName = @toolName_input,
    toolType = @toolType_input,
    sourceURL = @sourceURL_input
WHERE toolID = @toolID_selected;

-- Delete a Tool (will cascade delete related GameTools)
DELETE FROM Tools WHERE toolID = @toolID_selected;


-- ============================================================================
-- GAME PARTICIPANTS QUERIES (M:N Relationship)
-- ============================================================================

-- Get all Game Participants with Game and Participant details for browse page
SELECT gp.gameParticipantID, g.gameTitle, g.gameID,
       CONCAT(p.firstName, ' ', p.lastName) AS participantName,
       p.participantID, gp.role
FROM GameParticipants gp
INNER JOIN Games g ON gp.gameID = g.gameID
INNER JOIN Participants p ON gp.participantID = p.participantID
ORDER BY g.gameTitle, p.lastName;

-- Get a single Game Participant relationship by ID for the update form
SELECT gameParticipantID, gameID, participantID, role
FROM GameParticipants
WHERE gameParticipantID = @gameParticipantID_selected;

-- Get all Games for dropdown menu (used in add/update GameParticipants forms)
SELECT gameID, gameTitle
FROM Games
ORDER BY gameTitle;

-- Get all Participants for dropdown menu (used in add/update GameParticipants forms)
SELECT participantID, firstName, lastName
FROM Participants
ORDER BY lastName, firstName;

-- Add a new Game Participant relationship (associate a participant with a game)
INSERT INTO GameParticipants (gameID, participantID, role)
VALUES (@gameID_from_dropdown, @participantID_from_dropdown, @role_input);

-- Update a Game Participant relationship
UPDATE GameParticipants
SET gameID = @gameID_from_dropdown,
    participantID = @participantID_from_dropdown,
    role = @role_input
WHERE gameParticipantID = @gameParticipantID_selected;

-- Delete a Game Participant relationship (remove participant from game)
DELETE FROM GameParticipants WHERE gameParticipantID = @gameParticipantID_selected;


-- ============================================================================
-- GAME TOOLS QUERIES (M:N Relationship)
-- ============================================================================

-- Get all Game Tools with Game and Tool details for browse page
SELECT gt.gameToolID, g.gameTitle, g.gameID, t.toolName,
       t.toolID, gt.notes
FROM GameTools gt
INNER JOIN Games g ON gt.gameID = g.gameID
INNER JOIN Tools t ON gt.toolID = t.toolID
ORDER BY g.gameTitle, t.toolName;

-- Get a single Game Tool relationship by ID for the update form
SELECT gameToolID, gameID, toolID, notes
FROM GameTools
WHERE gameToolID = @gameToolID_selected;

-- Get all Games for dropdown menu (used in add/update GameTools forms)
SELECT gameID, gameTitle
FROM Games
ORDER BY gameTitle;

-- Get all Tools for dropdown menu (used in add/update GameTools forms)
SELECT toolID, toolName
FROM Tools
ORDER BY toolName;

-- Add a new Game Tool relationship (associate a tool with a game)
INSERT INTO GameTools (gameID, toolID, notes)
VALUES (@gameID_from_dropdown, @toolID_from_dropdown, @notes_input);

-- Update a Game Tool relationship
UPDATE GameTools
SET gameID = @gameID_from_dropdown,
    toolID = @toolID_from_dropdown,
    notes = @notes_input
WHERE gameToolID = @gameToolID_selected;

-- Delete a Game Tool relationship (remove tool from game)
DELETE FROM GameTools WHERE gameToolID = @gameToolID_selected;


-- ============================================================================
-- ADDITIONAL USEFUL QUERIES
-- ============================================================================

-- Search Participants by name or skills (for search functionality)
SELECT participantID, firstName, lastName, email, handle, skills
FROM Participants
WHERE firstName LIKE CONCAT('%', @search_input, '%')
   OR lastName LIKE CONCAT('%', @search_input, '%')
   OR skills LIKE CONCAT('%', @search_input, '%')
ORDER BY lastName, firstName;

-- Search Games by title, engine, or genre (for search functionality)
SELECT g.gameID, g.gameTitle, g.engine, g.genre, g.submissionURL,
       g.status, g.score, j.jamName
FROM Games g
INNER JOIN Jams j ON g.jamID = j.jamID
WHERE g.gameTitle LIKE CONCAT('%', @search_input, '%')
   OR g.engine LIKE CONCAT('%', @search_input, '%')
   OR g.genre LIKE CONCAT('%', @search_input, '%')
ORDER BY g.gameTitle;

-- Get all Games for a specific Jam (for filtering)
SELECT g.gameID, g.gameTitle, g.engine, g.genre, g.submissionURL,
       g.status, g.score
FROM Games g
WHERE g.jamID = @jamID_selected
ORDER BY g.gameTitle;

-- Get all Participants for a specific Game (for viewing game team)
SELECT p.participantID, p.firstName, p.lastName, p.email,
       p.handle, gp.role
FROM GameParticipants gp
INNER JOIN Participants p ON gp.participantID = p.participantID
WHERE gp.gameID = @gameID_selected
ORDER BY p.lastName, p.firstName;

-- Get all Tools used for a specific Game (for viewing game's tech stack)
SELECT t.toolID, t.toolName, t.toolType, t.sourceURL, gt.notes
FROM GameTools gt
INNER JOIN Tools t ON gt.toolID = t.toolID
WHERE gt.gameID = @gameID_selected
ORDER BY t.toolName;

-- Get game statistics for a specific Jam (for reporting)
SELECT
    COUNT(*) as total_games,
    AVG(score) as average_score,
    MAX(score) as highest_score,
    MIN(score) as lowest_score
FROM Games
WHERE jamID = @jamID_selected;
