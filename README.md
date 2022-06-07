
# Projet 7 : Groupomania - OpenClassrooms

Within this project I had to build a small Social Network from scratch for Groupomania Company, a small real-estate company.

Here I worked with, Mysql and NodeJS in the backend and VueJS framework in the frontend.







# Installation
You need npm to be installed on your computer. Then in the main project file run your IDE or Bash.

## - BackEnd installation -

### # Mysql + DataBase creation 
Install Mysql on your computer, then copy/paste and run the whole commands from the root file "MySqlCreate.txt" in a new Mysql tab.
Note : the first user (user_id = 1) is the admin and can remove & edit all the posts & comments.
You can edit the VALUES to chose your own password & mail etc... 
Default admin login / password are : admin@test.com  / Test1234 

### # Backend -
Now, from the main folder, run this commands :

```bash
cd .\backend\

mkdir images

echo > ".env"

```
Now open the empty .env file and paste the following command lines into it. You should edit DB_PASSWORD with your personal Mysql password, you can also chose your own TOKEN string, then save the .env file.
```bash 
# MYSQL
DB_PASSWORD="YourMySqlPassword"
DB_HOST=localhost
DB_USER=root
DB_NAME=groupomania


#JSONWEBTOKEN
TOKEN=YourRandomString
```
You can now launch a NodeJs server with :
```bash
node server
```
## - FrontEnd installation -
Open a new terminal (ctrl + shift + ù) and run the following :
```bash
cd .\frontend\
npm install
```
🥳🎉 Great ! You can now launch a localhost frontend server :
```bash
npm run serve
```
@ 
 http://localhost:8080/  ✔️

