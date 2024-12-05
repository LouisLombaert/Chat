# Projet Chat
Voici une application de chat anonyme, composée d'une seule page (SPA) où les utilisateurs peuvent envoyer anonymement des messages. 
## Présentation
### Technologies utilisées

Le développement du Backend s'est fait avec l'aide du Framework NestJS ainsi que d'une base de données SQLite et de l'ORM TypeORM.
Le développement du Frontend s'est fait avec l'aide de React et MaterialUi pour le design.

### Réalisation
Le backend de l'application a été réalisé en premier. La première étape a été la création de la base de donnée, basée sur un schéma que j'ai réalisé:  [Lien vers le schéma](https://github.com/LouisLombaert/Chat/wiki/Base-de-donn%C3%A9es#sch%C3%A9ma-de-la-base-de-donn%C3%A9e).

J'ai procédé d'abord à la création des entités (fournies par TypeORM) afin de créer les tables et leurs relations. Ensuite, j'ai poursuivi le développement du backend afin de créer les APIs nécessaires à l'application nécessaire pour que les fonctionnalités souhaitées soient réalisées. [Liste des APIs](https://github.com/LouisLombaert/Chat/wiki/API)

L'étape suivante à été la réalisation du Frontend. 3 composants ont été créé: 
 - Le composant **Chat** qui gère l'affichage des messages précédemment  envoyés ainsi que l'envoie de nouveau message
 - Le composant **Register**, contenant un Modal qui permet à l'utilisateur de rentrer son pseudo
 - Le composant **Modify**, contenant un Modal qui permet à l'utilisateur d'éditer un des messages qu'il a envoyé

Par la suite, les modals **Register** et **Modify** ont été inclus dans le composant Chat, car la séparation des trois provoquait des défauts: pour **Register**, l'utilisateur devait rafraichir la page afin que les messages s'affichent correctement (les messages envoyés par l'utilisateur courant s'affichent différemment) et pour **Modify**, il devait également rafraichir la page afin que le nouveau contenu du message modifié soit affiché.

## Démarrer l'application
 - Frontend
```
cd frontend
npm start
```
 - Backend
```
cd backend
npm run start
```
ou
```
cd backend
npm run start:dev // pour relancer à chaque changement
```

## Piste d'amélioration 
Voici un analyse de l'impacts que ces fonctionnalités pourraient avoir sur notre application
### En tant qu'utilisateur, je peux liker les messages des autres
Cette nouvelle fonctionnalité  aura pour première conséquence la création d'une nouvelle table en base de données (la table Like).
Celle-ci contiendra trois colonnes  : 
 -  **id**: La clé primaire du like (générer automatiquement)
 -  **UserID** : une clé étrangère pointant vers la colonne id de la table User, représentant l'id de l'utilisateur ayant liké le message.
 -  **MessageID** : une clé étrangère pointant vers la colonne id de la table Message, représentant l'id du message que l'utilisateur à liké.
[Schéma de cette base de données](https://github.com/LouisLombaert/Chat/wiki/Base-de-donn%C3%A9es#sch%C3%A9ma-avec-la-table-like)
Une fois que notre table est ajoutée à la DB, il faudra procéder à la création d'une nouvelle API ainsi qu'à la logique liée à celle-ci. Cette API, qu'on nommera **message/like**, sera de type POST, et prendra en body deux paramètres: l'id de l'utilisateur et l'id du message liké).
Notre code se chargera de créer une nouvelle entrée dans la table Like avec ces donées. Si une erreur à eu lieu durant ce processus, l'api renvoie un code d'erreur.

Du côté du Frontend, il faudra ajouter un bouton sur chaque message (hormis ceux que l'utilisateur actuellement connecté a envoyé) qui, une fois cliqué, exécutera une fonction qui fera appel à notre API message/like. Elle passera dans son body l'id 
de l'utilisateur actuellement connecté et l'id du message auquel le bouton sur lequel l'utilisateur a cliqué était associé.

### En tant qu'utilisateur, je peux voir le nombre de likes par message.
Pour cette fonctionnalité, il faudra modifier notre API GET /message. Celle-ci devra maintenant renvoyer, en plus des données qu'elle renvoyait précédemment, le nombre de likes pour chaque message. Pour cela, il suffit de compter le nombre d'entrée dans la table like dont la valeur de Message ID est égale à la valeur de l'id du message, et nous pourrons ainsi récupérer le nombre de like par message. 
Du côté du frontend, il faut rajouter un champ en dessous de chaque message indiquant le nombre de likes. Lorsque l'utilisateur like un message, ce nombre doit augmenter sans devoir refaire appel à l'API. Cela peut être rendu possible grâce à la gestion des états de React (useState).

### Authentification des utilisateurs
Afin que l'utilisateur puisse se connecter (ou s'inscrire), il nous faudra modifier notre composant Register. Ce dernier devra permettre à l'utilisateur de choisir s' il souhaite se connecter, ou s'inscrire s' il ne s'est pas encore enregistré. Les formulaires de connexion et d'inscription seront composés d'un input permettant d'entrer une adresse mail et d'un autre permettant d'entrer un mot de passe, en plus du bouton de soumission du formulaire. Lors de l'inscription, un mail sera envoyé à l'utilisateur afin qu'il puisse confirmer son adresse. Une fois ceci fait, il sera connecté à l'application et pourra accéder au Chat. Lors de la connexion, si l'utilisateur entre un mauvais mot-de-passe ou adresse mail, un message d'erreur est renvoyé. Sinon, il est connecté et peut accéder aux chat.

Suite à cela, l'authentification peut être gérée via l'utilisation de deux méthodes différentes: en utilisant des cookies ou des tokens (JSON Web Token ou JWT). Supposons que nous utilisions des JWTs (meilleurs d'un point de vue sécurité, même si moins performant), cela veut dire qu'un Token sera générer du côté du serveur à chaque fois que l'utilisateur se connecte/s'enregistre et que celui-ci encapsulera ses données d'identification. Une fois généré, le Token est envoyé au client pour être stocké dans le localStorage. Pour chaque requête, il faudra dorénavant envoyer le Token dans l'en-tête Authorization afin que le serveur puisse vérifier qu'il est authentique et qu'il identifie l'utilisateur. 

### Envoi de notification en temps réel
L'envoi de notification peut être rendu possible par l'utilisation de l'API Notifications. Afin de pouvoir recevoir des notifications, une autorisation de l'utilisateur doit être accordée. Il faut donc utiliser une méthode afin de lui demander celle-ci: **Notification.requestPermission()**.

À chaque fois que l'API POST /message est appelé et qu'elle ne retourne pas d'erreur, il faudra donc créer une notification qui sera envoyée à tous les utilisateurs. Ensuite, il faut encore ajouter un gestionnaire d'événement (document.addEventLisenner) afin que la notification se ferme dès que l'utilisateur la voit. 

## Source

(28/11/2023). *Authentification par jeton (JWT) et authentification par cookie*.  forum.huawei.com. https://forum.huawei.com/enterprise/fr/Authentification-par-jeton-JWT-et-authentification-par-cookie/thread/729629562100400128-667480999820406784

*Utiliser l'API Notifications*. developer.mozilla.org. https://developer.mozilla.org/fr/docs/Web/API/Notifications_API/Using_the_Notifications_API
