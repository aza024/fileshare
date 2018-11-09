# FileShare

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

Once a user decides to sign up for FileShare, their account is validated to ensure users can't sign up with the same email more than twice. User passwords are securely stored passwords and hashed using BCrypt with validation on the front and backend.

![image](https://user-images.githubusercontent.com/38674075/48247812-8ed37100-e3a9-11e8-8a04-6832ac2ca394.png)
![image](https://user-images.githubusercontent.com/38674075/48247807-88dd9000-e3a9-11e8-9f9b-917fad0e17ab.png)

**Authentication:** 

FileShare lets users can safely store their files using JWT tokens for authentication and securely share their files - 
even with users that do not have a FileShare account.
![image](https://user-images.githubusercontent.com/38674075/48247810-8b3fea00-e3a9-11e8-9061-a91d1aeae417.png)

**Upload Files to AWS:**

**Download Files from AWS:**

**Sharing Files:** By utilizing secure UUID links, non-users have the option to preview or download the shared files.

**.txt File Creation In Browser:** Users have the option to create a .txt file directly in the browser which they can then upload or download to their local 
file system.

**Search**

**Sort**
FileShare has many other features such as the ability to view stored files in user browsers - view images or play mp4 files. 
Multiple forms of searching and sorting are supported, allowing users to find their files very quickly.



  

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
