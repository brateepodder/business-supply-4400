# 📦 Business Supply

Business Supply is a dynamic web application designed to help businesses manage their inventory and supplies seamlessly. This project demonstrates a modern full-stack implementation using a MySQL database, Express.js backend, and a user-friendly frontend interface.

This was created by Bratee Podder and Yueru Zhou, Phase IV Group 38, of GeorgiaTech's CS4400 (Introduction to Databases) class. 

Please scroll down to read our instructions on how to use this repository in your local computer with your local database. 

To learn more you can also access our Notion page: https://seemly-digit-e6a.notion.site/Phase-IV-CS4400-14e9f7fa2d4980a181a2fb94ed985d1d?pvs=4

---

## 🌟 Features
- Manage and track business inventory effectively.
- Dynamic forms for creating, updating, and deleting records.
- Real-time database communication with a MySQL backend.
- Autocomplete to make searching for certain specific information users. 

---

## 🚀 How to Use the Website
### 1. **Homepage**
   - Access the homepage to view key options for interacting with the database. This homepage shows where each stored procedure and view is located in our webapp.
 [<img src="[https://img.youtube.com/vi/<VIDEO_ID>/hqdefault.jpg](https://github.com/user-attachments/assets/7868aa67-1ba0-427e-b5fb-c0c152928819
)" width="600" height="300"
/>]([https://www.youtube.com/embed/<VIDEO_ID](https://github.com/user-attachments/assets/7868aa67-1ba0-427e-b5fb-c0c152928819
)

### 2. **Use our stored procedures**
   - Navigate to the different pages through our navigation bar to interact with our stored procedures. 
   
### 3. **Real-time updates**
   - Recieve real time updates when you use the stored procedures to change our views.


### 4. **Recieve real time responses from the database**
   - In case of any errors with the stored procedure arguments, you will receive real-time feedback on the issues or if it updated successfully.
https://github.com/user-attachments/assets/80ea5285-6330-4ed1-b6c4-ab1d0eed277c

### 5. **Easier searches with autocomplete**
   - Use our Autocomplete feature (thanks to NextUI) to search up pre-existing information on our database and use that to fill out the procedures form. 
https://github.com/user-attachments/assets/7248735a-cd76-45db-b6fe-d20a8d533753



---

## 🛠️ Setup Instructions
Follow these steps to download and run the project locally:

### 1. Clone the Repository
Open a terminal and run the following command:
```bash
git clone https://github.com/your-username/business-supply.git
cd business-supply
```

### 2. Create your own dotenv in the api folder (backend folder)
```bash
cd api
touch .env
```
or you can manually create a new .env file under the api folder.

Enter the following information in your .env file: 
```bash
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=business_supply
DB_PORT=3306
PORT=your_backend_port
```

Fill in all the fields according to what they need to be for you. DB_HOST should be localhost as we are using our local database running in MySQL. 

If your password is null (you can check this by opening MySQLWorkbench and clicking the Local Instance, see if it requires a password or not. If it does require a password, enter the password under DB_PASSWORD=your_password or else leave it null so just DB_PASSWORD=). 

Make sure that your MySQL uses local instance 3306. It will usually say this on the front page when you open MySQLWorkbench and you have to choose which connection you want. If there is another number than 3306, go ahead and change DB_PORT to that number. 

The username is often root but this can also be found on the front page under connections.

### 4. Change the port number in .env and ConfigContext.tsx

Choose what port you want to use for your backend (usually use a free port like 5000, 8000, 8080 etc.). Enter this number in your .env file for the PORT variable. 

Then, navigate to the ConfigContext.tsx file located under /business-supply-frontend/app/ConfigContext.tsx and go to line 27. 

```bash
port: process.env.PORT || "5000", // change this to what you need
```

Change the port to the one you decide to use for your backend. If you use 8080, then the line would be: 
```bash
port: process.env.PORT || "8080", // change this to what you need
```


### 5. Download node

If you don't already have node, please download it. 

https://nodejs.org/en/download/prebuilt-installer

Ensure that your version is 22 or above. You can do this by opening a terminal and typing "node --v". 

Then in the root folder (business-supply-4400), run "npm install" to download all required packages to run this webapp. 

### 6. Run the database and stored procedure file

Open your MySQLWorkbench and run the correct database file (cs4400_phase2_database_schema_SOLUTION_v1.sql) and download our stored procedures file through gradescope's Phase III - Full Autograder latest submission. First run the schema file and then the stored procedures file and make sure that all the right views and stored procedures show up underneath the database. 

### 7. Run the frontend and backend

Run your frontend by navigating to the frontend directory and type "npm run dev":
```bash
cd business-supply-frontend
npm run dev
```

Open a separate terminal and navigate to the "api" folder (backend directory) and type "node server.js": 
```bash
node server.js
```

### 8. Run your project on a browser

Type "http://localhost:3000" in your browser search to be greeted with the front page. 





