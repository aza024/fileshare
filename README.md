# FileShare

FileShare is a full-stack file-sharing application built using Node/Express and JavaScript that allows users to upload or 
download files to AWS and share files using a UUID link. 
Hosted on AWS using EC2, FileShare stores user files using an S3 Bucket with password storage backend by PostgreSQL in RDS.

## Features: 

**Account Creation:** 

Users can sign up for a FileShare account with securely stored passwords that are hashed using BCrypt and validated on the front and backend.

**Authentication:** FileShare lets users can safely store their files using JWT tokens for authentication and securely share their files - 
even with users that do not have a FileShare account.

**Upload Files to AWS:**

**Download Files from AWS:**

**Sharing Files:** By utilizing secure UUID links, non-users have the option to preview or download the shared files.

**.txt File Creation In Browser:** Users have the option to create a .txt file directly in the browser which they can then upload or download to their local 
file system.

**Search**

**Sort**
FileShare has many other features such as the ability to view stored files in user browsers - view images or play mp4 files. 
Multiple forms of searching and sorting are supported, allowing users to find their files very quickly.


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
