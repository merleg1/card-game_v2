# "Prinzipe öber bord" studio_UxWebmobile2_2023
Online web card game like "cards against humanity". Create a room and let other players join by sharing a link or a code. When everyone has joined, the admin can start the game. Now select the card that fits best with the question of the round and is the funniest. One some questions you can play more than one card. After all players have played the voting phase starts and everyone can pick their favorite. The player with the most votes gets a point and wins the round. When all rounds are played the person with the most points takes it home. The project was done using node.js, express, socket.io and vue. 

# How to start?
Requirements: node.js
1. Clone repo
2. Install packages in the client and the server with npm i
3. Start the server with node app.mjs
4. Start vue with npm run dev

# How to play?
1. Open the shown url in the browser
2. Create a room and share the code
(each browser shares the same session, if you wanna test it on yourself you can open incognito tab and other browsers)
3. Join the room, you need atleast 4 players
4. Let the admin start the game
5. Play cards by dragging them to the question, wait for the other players
6. Vote for the choises that you find the funniest, wait for players to vote
7. players get points and a new round starts (you can open the scoreboard at the top right)

# Architecture diagram
![card-g drawio (1)](https://user-images.githubusercontent.com/91537937/233638252-e47449c5-f55c-4812-a4a3-8e6d3540521c.png)

# Sequence diagram
```mermaid
sequenceDiagram
    participant Client1
    participant Client2
    participant Server
Client1->>Server:Connect with sessionID from localStorage
Client1<<-Server:Send session data and userID

```
