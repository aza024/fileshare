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
  * Run command: ``npm i``
  * Followed by: ``npm start``

## Features: 

## Account Creation: 

Once a user decides to sign up for FileShare, their account is validated to ensure users can't sign up with an existing email which is used as a primary key in the Postgres Database. User passwords are securely stored passwords and hashed using BCrypt with validation on the front and backend.

![image](https://user-images.githubusercontent.com/38674075/48247812-8ed37100-e3a9-11e8-8a04-6832ac2ca394.png)
*FileShare Landing page with options to sign in or sign up*

![image](https://user-images.githubusercontent.com/38674075/48247807-88dd9000-e3a9-11e8-9f9b-917fad0e17ab.png)
*Sign Up portion of the modal allows users to create accounts, validating input on the front and back end*
## Authentication:

JWT tokens are used to authenticate users that are attempting to sign in. Once a user is signed in, they are given the list file permission that allows users to see files associated with their account. A capabiliites model was enforced to protect file downlaods where the ability to list or name a file gives the user the ability to download the file enforced using a UUID being attached to each file. Because of the capabilities model, it is possible for authenticated users to delgate file download permissions to non-users, making file-sharing trival and secure. This allows user to share their file with non-users using UUID. Anyone can download files from FileShare, but only if they have the UUID-based token associated with that file.

![image](https://user-images.githubusercontent.com/38674075/48247810-8b3fea00-e3a9-11e8-9061-a91d1aeae417.png)
*Sign In portion of modal*

## Upload Files to AWS:

When a user clicks the 'Choose File' button, their local file system will be displayed and the user can select a file to upload. Once the user selects the file, and then clicks 'upload' the file will be uploaded to an SWS S3 bucket associated with their account and data with functions regarding the file will be rendered on their account page. The user can view stored files in user browser.

![image](https://user-images.githubusercontent.com/38674075/48247803-854a0900-e3a9-11e8-984f-4dff4b5ddaea.png)
*Blank FileShare Profile. This is what a profile with no files uploaded to S3*

![image](https://user-images.githubusercontent.com/38674075/48247801-82e7af00-e3a9-11e8-9765-a9de05c8c54e.png)
*When ‘Choose File’ is clicked, a user can select a file from their local system*

![image](https://user-images.githubusercontent.com/38674075/48247795-7fecbe80-e3a9-11e8-9d3a-8329463cb0fa.png)
*Rendered file that has been uploaded to AWS with functions relating to the specific file*

## Download Files from AWS:

Once a user uploads a file, and they click the 'Download' button, the associated file will be downloaded to the download folder associated with their browser. 

![image](https://user-images.githubusercontent.com/38674075/48247789-7bc0a100-e3a9-11e8-8ab2-e71d083ee8bf.png)
*Example of file being downloaded to local file system - see bottom left corner*

![image](https://user-images.githubusercontent.com/38674075/48247762-63508680-e3a9-11e8-9246-4663e84a00aa.png)
*Files uploaded to the users S3 bucket on AWS*


## Preview Images and Videos:

For file extensions of .img, .png, .jpg, or .jpg, users can view the image that they uploaded. Users can play videos of mp4 file types.

![image](https://user-images.githubusercontent.com/38674075/48247756-60559600-e3a9-11e8-8d01-ad90dc56a12e.png)
*.jpg Render showing preview functionality*

![image](https://user-images.githubusercontent.com/38674075/48247785-76635680-e3a9-11e8-993f-7ef6ecc87fe7.png)
*.mp4 preview and video playing functionality*


## Sharing Files: 

By utilizing secure UUID links, non-users have the option to preview or download the shared files.

![image](https://user-images.githubusercontent.com/38674075/48247754-5d5aa580-e3a9-11e8-947d-3a939aca4fad.png)
*When ‘share’ button is clicked, user receives a link to share with non-users*

![image](https://user-images.githubusercontent.com/38674075/48247751-59c71e80-e3a9-11e8-9a8c-6b0435f83847.png)
*Local storage for a logged-in user*

![image](https://user-images.githubusercontent.com/38674075/48247727-45832180-e3a9-11e8-87e3-a161251be783.png)
*Example of image being downloaded *

![image](https://user-images.githubusercontent.com/38674075/48247748-5764c480-e3a9-11e8-88d5-86a25d0cf281.png)
*Shared file - a user does not exist in local storage. The non-user can preview or download the image that was shared with them. *

![image](https://user-images.githubusercontent.com/38674075/48247719-3bf9b980-e3a9-11e8-9ea8-f4129ba8b67d.png)
*Image preview from shared file*

## .txt File Creation In Browser:

Users have the option to create a .txt file directly in the browser which they can then uploa the file to AWS, or download the file to their local file system.

![image](https://user-images.githubusercontent.com/38674075/48247778-706d7580-e3a9-11e8-9543-bff5a01af8f8.png)
*When green ‘+’ icon is pressed, a file editor will appear in a modal *

![image](https://user-images.githubusercontent.com/38674075/48247774-6d728500-e3a9-11e8-8f98-6b9551426443.png)
*Demonstrates a file being created*

![image](https://user-images.githubusercontent.com/38674075/48247770-69defe00-e3a9-11e8-9aac-44269717bb93.png)
*File being downloaded to browser*

## Search:

Multiple forms of searching and sorting are supported, allowing users to find their files very quickly.
When a user inputs text into the 'Search' bar, all files that contain the input string from the search bar and will be rendered in the file list area. 

![image](https://user-images.githubusercontent.com/38674075/48247788-795e4700-e3a9-11e8-9c12-d652c14a14d8.png)
*Search feature with files containing the string ‘DEM’ in their name are rendered*

## Sort:
Fileshare can sort file lists five different ways by selecting the dropdown arrow and selecting one of the following options:

* Most Recent 
* Least Recent 
* Alphabetic
* Reverse Alphabetic 
* File Size

Once the user selects one of the options, the files will be reordered according to the users selection.
In additon to sorting files, each file extension is categorized with a different color for visual representation of file types.

![image](https://user-images.githubusercontent.com/38674075/48247782-73686600-e3a9-11e8-844f-9b23c25ffdad.png)
*Example of files being sorted from smallest to largest size*  

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
- Revoke access to shared files
- Implement folder system 
