# Phonezone
This project is an eComerce web application that sells mobile phones. 

# Description
This web application represents a mobile online store. It allows anyone to see best sellers and sold out soon phones 
on the main page. Also, user is able to search a mobile phone using search bar in the database of phones by phone name or part of the name.
User can see phone details, such as reviews and stock by clicking on a row corresponding to mobile phone. If user want's to purchase any mobile phone user should login/signup using email and password (password is hashed before storing in data base). 
Authenticated user will be able to purchase any amount that of any mobile phone while phone stock allows it. To purchase a phone, user should go to phone details and add it to the cart there. 
For a checkout authenticated user should go to checkout page where user can change quantity of phones in the cart or delete them. And to proceed with checkout user should click checkout button in the bottom of checkout page. 
Authenticated user can see his/her details by clicking on My profile button in navigation bar. On edit profile page user can edit his/her first name, last name and email. On change password page user can change password and on manage listings page
there is a list of phone listings created by user. There user can create a new listing by clicking white plus sign in a green circle. Logged in user is able to logout by pressing Log out in the top right corner. 

# Dependencies
Before starting the web application, the user should install all dependencies using the command "npm install" in the same location as the server.js file. 
 - nodemon: 2.0.7
 - express: 4.17.1
 - express-session: 1.17.2
 - mongoose: 5.12.7


# Also using
 - MongoDB version 4.4
 - Robomongo version 1.4.3

# Installing
 - This web application is available at https://github.com/Vlado-1/PastProjects
# Executing
 - Before executing user should start db using command "mongod.exe --dbpath <mongoDB file location>" in the location of "MongoDB\Server\4.4\bin" file
 - User should create database called phonezone in robomongo.
 - 2 collections should be created in mongodb: "phonelistings" and "users".
 - To transfer JSON files in 'data' folder to db, user should run commands: "mongoimport --jsonArray --db phonezone --collection phonelistings --file <location of JSON file containing phones db>" 
and "mongoimport --jsonArray --db phonezone --collection users--file  <location of JSON file containing users db>" 
 - Open files in nodejs, right click on the server.js and choose "Run As > Node Program" 
 - Go to "localhost:3000" in your browser
# Help
 - If you run into the problem that checkout page does not display amounts of phones in cart and total price, refresh the page.
 - If there is any problems with cart or checkout. Refreshing the page or logout/login helps.

# Authors
 Vladislav Makarov  
 Alex Vaskevich  
 Vlado Smolovic  

# Version History
 - 0.1 initial release
