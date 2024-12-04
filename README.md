# Projet Chat
Voici une application de chat anonyme, composée d'une seule page (SPA) où les utilisateurs peuvent envoyer anonymement des messages. 
## Présentation
### Technologies utilisées

Le développement du Backend s'est fait avec l'aide du Framework NestJS ainsi que d'une base de donée SQLite et de l'ORM TypeORM.
Le développement du Backend s'est fait avec l'aide de React et MaterialUi pour le design.

### Réalisation
Le backend de l'application a été réalisé en premier. La première étape à été la création de la base de donnée, basée sur un schéma que j'ai réalisé:  [Lien vers le schéma](https://github.com/LouisLombaert/Chat/wiki/Base-de-donn%C3%A9es#sch%C3%A9ma-de-la-base-de-donn%C3%A9e).
J'ai procédé d'abord à la création des entités (fournies par TypeORM) afin de créer les tables et leurs relation. Ensuite, j'ai poursuivi le développement du backend afin de créer les APIs nécessaires à l'application nécessaire pour que les fonctionalités souhaités soit réalisés. [Liste des APIs](https://github.com/LouisLombaert/Chat/wiki/API)

L'étape suivante à été la réalisation du Frontend. 3 composants ont été créé: 
 - Le composant Chat qui gère l'affichage des messages précédement envoyés ainsi que l'envoit de nouveau message
 - Le composant Register, contenant un Modal qui permet à l'utilisateur de rentrer son pseudo
 - Le composant Modify, contenant un Modal qui permet à l'utilisateur d'éditer un des messages qu'il a envoyé

## Piste d'amélioration 
Voici un analyse de l'impacts que deux fonctionnalités pouraient avoir sur notre application
### En tant qu'utilisateur, je peux liker les messages des autres
Cette nouvelle fonctionalités aura pour première conséquence la création d'une nouvelle table en base de données (la table Like).
Celle-ci contiendra trois colonnes  : 
 -  id: La clé primaire du like (générer automatiquement)
 -  UserID : une clé étrangère pointant vers la colonne id de la table User, représentant l'id de l'utilisateur ayant liker le message.
 -  MessageID : une clé étrangère pointant vers la colonne id de la table Message, représentant l'id du message que l'utilisateur à liké.
[Schéma de cette base de données]()
Une fois que notre table est ajoutée à la DB, il faudra procéder à la création d'une nouvelle API ainsi qu'à la logique liée à celle-ci. Cette API, qu'on nommera message/like, sera de type POST, et prendra en body deux paramettres: l'id de l'utisateur et l'id du message liké).
Notre code ce chargera de créer une nouvelle entrée dans la table Like avec ces donées. Si une erreur à eu lieu durant ce processus, l'api renvoit un code d'erreur.

Du côté du Frontend, il faudra ajouter un boutton sur chaque message (hormis ceux que l'utilisateur actuelement connécté a envoyé) qui, une fois cliqué, executera une fonction qui fera appel à notre API message/like. Elle passera dans son body l'id 
de l'utilisateur actuellement connecté et l'id du message auquel le boutton sur lequel l'utilisateur a cliqué était associé.

### En tant qu'utilisateur, je peux voir le nombre de likes par message.
Pour cette fonctionnalité, il faudra modifier notre API GET /message. Celle-ci devra maintenant renvoyer, en plus des données qu'elle renvoyait précédemment, le nombre de like pour chaque message. Pour cela, il suffit de compter le nombre d'entrée dans la table like dont la valeur de MessageID est égale à la valeur de l'id du message, et nous pourrons ainsi récuperer le nombre de like par message. 
Du côté du frontend, il faut rajouter un champ en dessous de chaque message indiquant le nombre de likes. Lorsque l'utilsateur like une message, ce nombre doit augmenter sans devoir refaire appel à l'API. Cela peut être rendu possible grâce à la gestion des états de React (useState).

