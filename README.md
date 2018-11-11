# FileShare
**ReadME is currently being edited and may not contain all information**
FileShare is a full-stack, single-page file-sharing application built using Node/Express and JavaScript that allows users to upload or download files to and AWS using EC2 with S3 Buckets and share files using a UUID link. 


## Built With: 
* HTML/CSS
* Javascript 
* jQuery
* Node/Express
* PostgreSQL 
* AWS EC2 and S3 buckets(file storage)
* Bcrypt(hashing of passwords)
* JWT Tokens(authentication purposes)
* UUID's(safe sharing with non-users)
* UTF8 (URL Encoding)

## Cloning the Project: 
To run this project on your machine you'll need: 
  * An AWS account is required, along with an EC2 instance with S3 buckets for file storage.
  * An instance of a PostgreSQL database to hold user credentials
  * Run ``npm i``
  * ``npm start``


## Features: 

**Account Creation:** 
Upon reaching the homepage, the user has the option to sign in to their account, or create a new account. 

![image](https://user-images.githubusercontent.com/38674075/48247812-8ed37100-e3a9-11e8-8a04-6832ac2ca394.png)

Once a user decides to sign up for FileShare, their account is validated to ensure users can't sign up with the same email more than twice. User passwords are securely stored passwords and hashed using BCrypt with validation on the front and backend.

![image](https://user-images.githubusercontent.com/38674075/48247807-88dd9000-e3a9-11e8-9f9b-917fad0e17ab.png)

**Authentication:** 

FileShare lets users can safely store their files using JWT tokens for authentication and securely share their files - 
even with users that do not have a FileShare account.
![image](https://user-images.githubusercontent.com/38674075/48247810-8b3fea00-e3a9-11e8-9061-a91d1aeae417.png)

**Upload Files to AWS:**
![image](https://user-images.githubusercontent.com/38674075/48247803-854a0900-e3a9-11e8-984f-4dff4b5ddaea.png)
![image](https://user-images.githubusercontent.com/38674075/48247801-82e7af00-e3a9-11e8-9765-a9de05c8c54e.png)
![image](https://user-images.githubusercontent.com/38674075/48247795-7fecbe80-e3a9-11e8-9d3a-8329463cb0fa.png)



**Download Files from AWS:**
![image](https://user-images.githubusercontent.com/38674075/48247789-7bc0a100-e3a9-11e8-8ab2-e71d083ee8bf.png)
7
![image](https://user-images.githubusercontent.com/38674075/48247762-63508680-e3a9-11e8-9246-4663e84a00aa.png)

6
![image](https://user-images.githubusercontent.com/38674075/48247756-60559600-e3a9-11e8-8d01-ad90dc56a12e.png)

**Preview Images and Videos**
![image](https://user-images.githubusercontent.com/38674075/48247785-76635680-e3a9-11e8-993f-7ef6ecc87fe7.png)
13


**Sharing Files:** By utilizing secure UUID links, non-users have the option to preview or download the shared files.
5
![image](https://user-images.githubusercontent.com/38674075/48247754-5d5aa580-e3a9-11e8-947d-3a939aca4fad.png)

4
![image](https://user-images.githubusercontent.com/38674075/48247751-59c71e80-e3a9-11e8-9a8c-6b0435f83847.png)

3
![image](https://user-images.githubusercontent.com/38674075/48247748-5764c480-e3a9-11e8-88d5-86a25d0cf281.png)
2
![image](https://user-images.githubusercontent.com/38674075/48247727-45832180-e3a9-11e8-87e3-a161251be783.png)
1
![image](https://user-images.githubusercontent.com/38674075/48247719-3bf9b980-e3a9-11e8-9ea8-f4129ba8b67d.png)


**.txt File Creation In Browser:** Users have the option to create a .txt file directly in the browser which they can then upload or download to their local 
file system.

9
![image](https://user-images.githubusercontent.com/38674075/48247774-6d728500-e3a9-11e8-8f98-6b9551426443.png)
10
![image](https://user-images.githubusercontent.com/38674075/48247778-706d7580-e3a9-11e8-9543-bff5a01af8f8.png)
8
![image](https://user-images.githubusercontent.com/38674075/48247770-69defe00-e3a9-11e8-9aac-44269717bb93.png)

**Search**
![image](https://user-images.githubusercontent.com/38674075/48247788-795e4700-e3a9-11e8-9c12-d652c14a14d8.png)

**Sort**
FileShare has many other features such as the ability to view stored files in user browsers - view images or play mp4 files. 
Multiple forms of searching and sorting are supported, allowing users to find their files very quickly.

11
![image](https://user-images.githubusercontent.com/38674075/48247782-73686600-e3a9-11e8-844f-9b23c25ffdad.png)
  

## Ongoing Improvements
- Transition from a Single Page App using jQuery to use ReactJS
- Allow users to preview text files
- Expand and restrict user files
- Improve UX/UI Design
- Accommodate multiple Uploads/Downloads/Shared Files
- Modal Functionality - Change function declarations to use ES6 format. Used function declarations to use $this function for simplicity in designing modal
- Send confirmation email upon signup to prevent attackers from signing up for an account that does not belong to the user.
- Prevent user from uploading duplicate files
- Resolve page redirection refreshing issues
- Revoke access to shared files
- Support for editing files
- Add spell check to in browser text file creation
