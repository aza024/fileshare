# FileShare
FileShare is a full-stack, single-page file-sharing application built using Node/Express and JavaScript that allows users to upload or download files to and AWS using EC2 with S3 Buckets and share files using a UUID link. 

## Built With: 
* Javascript 
* jQuery
* Node/Express
* PostgreSQL (store account information)
* AWS EC2 and S3 buckets(file storage)
* HTML/CSS
* Bcrypt(hashing of passwords)
* JWT Tokens(authentication purposes)
* UUID's(safe sharing with non-users)
* UTF8 (URL Encoding)
* Multer (handle file uploads)
* URIencode (allows files to be passed to URL in proper formatting)

## Cloning the Project: 
To run this project on your local computer you'll need: 
  * An AWS account along with an EC2 instance with S3 buckets for file storage.
  * An instance of a PostgreSQL database to hold user credentials using user model: 
  
  ```javascript
  users{
    pk_user_id = int, 
    username = varchar(30), 
    password = bytea, 
    email = varchar(60), 
    user_id = uuid
  }
  ```

  * Run command: ``npm i``
  * Followed by: ``npm start``

## Features: 

## Account Creation: 

Once a user decides to sign up for FileShare, their username and email address are validated to ensure users can't sign up with existing credentials. New users enter a username, email address, and password for account creation and new users enter their username and password to log into their account. User passwords are securely stored and hashed using BCrypt and validated on the front and backend to provide feedback and data integrity. The modal was created using jQuery, HTML, and CSS. 

![image](https://user-images.githubusercontent.com/38674075/48247812-8ed37100-e3a9-11e8-8a04-6832ac2ca394.png)
> *FileShare Landing page with options to 'Sign In' to their account or 'Sign Up' for an account.*

![image](https://user-images.githubusercontent.com/38674075/48247807-88dd9000-e3a9-11e8-9f9b-917fad0e17ab.png)
> *Sign Up portion of the modal allows users to create an account, providing feedback about data that was entered incorrectly.*

## Secure Authentication:

JWT tokens are used to authenticate users that are attempting to sign in. Once a user is signed in, they are given the 'list file' permission which allows users to see files associated with their account. A capabiliites model was enforced to protect file downlaods where the ability to list or name a file gives the user the ability to download the file. The capabilities model is enforced using a UUID that is attached to each filename for sharing purposes. Because of the capabilities model, authenticated users can delgate file download permissions to non-users making file-sharing trival and secure when a user shares a file with non-users using UUID's. Anyone can download files from FileShare, but only if they have the UUID-based token associated with that file.

![image](https://user-images.githubusercontent.com/38674075/48247810-8b3fea00-e3a9-11e8-9061-a91d1aeae417.png)
> *'Sign In' modal feature requesting username and password from person attempting to sign into their account.*

## Upload Files to AWS:

When a user clicks the 'Choose File' button, a GUI interface of their local file system will be displayed so the user can select the file they wish to upload to AWS. After the user selects a file and clicks the 'Upload' button, the associated file is uploaded to an AWS S3 bucket associated with their account. Information such as username, date uploaded, file type and filesize are rendered on the screen along with functions that can be made on each specific file. The purpose of the rendering is to allow the user to view thier stored files on AWS in thier browser.

![image](https://user-images.githubusercontent.com/38674075/48247803-854a0900-e3a9-11e8-984f-4dff4b5ddaea.png)
> *Once a user initially creates their account they will be redirected to a blank FileShare profile page with no files listed because their S3 bucket is empty.*

![image](https://user-images.githubusercontent.com/38674075/48247801-82e7af00-e3a9-11e8-9765-a9de05c8c54e.png)
> *When ‘Choose File’ is clicked, a user can select a file from their local system.*

![image](https://user-images.githubusercontent.com/38674075/48247795-7fecbe80-e3a9-11e8-9d3a-8329463cb0fa.png)
> *After a user clicks the 'Upload' button, the file that has been uploaded to AWS will be rendered along with features that can be taken on each file.*

## Download Files from AWS:

Once a user uploads a file, when they click the 'Download' button, the associated file will be downloaded to the download folder specified in their browser, typically the 'Downloads' folder. 

![image](https://user-images.githubusercontent.com/38674075/48247789-7bc0a100-e3a9-11e8-8ab2-e71d083ee8bf.png)
> *After clicking the 'Download' button, the file is downloaded to local file system as displayed in the bottom left corner of this image.*

![image](https://user-images.githubusercontent.com/38674075/48247762-63508680-e3a9-11e8-9246-4663e84a00aa.png)
> *Files uploaded to the users S3 bucket on AWS relevant to screenshots in this document.*


## Preview Images and Videos:

Users can view the image that they uploaded for file extensions of .img, .png, .jpg, or .jpg. Users can play videos of mp4 file types in their browser. Eventually, documents will be rendered. 

![image](https://user-images.githubusercontent.com/38674075/48247756-60559600-e3a9-11e8-8d01-ad90dc56a12e.png)
> *.jpg files can be previewed in the users browser*

![image](https://user-images.githubusercontent.com/38674075/48247785-76635680-e3a9-11e8-993f-7ef6ecc87fe7.png)
> *.mp4 video files can be previewed and played in the users browser*


## Sharing Files: 

Each file is associated with a secure UUID link which gives non-users who have the link the option to preview or download the shared files.

![image](https://user-images.githubusercontent.com/38674075/48247754-5d5aa580-e3a9-11e8-947d-3a939aca4fad.png)
> *When ‘Share’ button is clicked, user receives a link to share the file with non-users*

![image](https://user-images.githubusercontent.com/38674075/48247751-59c71e80-e3a9-11e8-9a8c-6b0435f83847.png)
> *Local storage for a logged-in user*

![image](https://user-images.githubusercontent.com/38674075/48247727-45832180-e3a9-11e8-87e3-a161251be783.png)
> *Image Download*

![image](https://user-images.githubusercontent.com/38674075/48247748-5764c480-e3a9-11e8-88d5-86a25d0cf281.png)
> *When a non-user obtains a link for a shared file, no information exists in local storage. The non-user can preview or download the file that was shared with them.*

![image](https://user-images.githubusercontent.com/38674075/48247719-3bf9b980-e3a9-11e8-9ea8-f4129ba8b67d.png)
> *User previewing an image from shared file*

## .txt File Creation In Browser:

Users have the option to create a .txt file directly in the browser which they can then uploa the file to AWS, or download the file to their local file system.

![image](https://user-images.githubusercontent.com/38674075/48247778-706d7580-e3a9-11e8-9543-bff5a01af8f8.png)
> *When green ‘+’ icon is clicked, a file editor will appear in a modal*

![image](https://user-images.githubusercontent.com/38674075/48247774-6d728500-e3a9-11e8-8f98-6b9551426443.png)
> *Users enter a filename with extension and file body. They can click 'Upload' to upload to their account and AWS or download, and download the file to their local file system.*

![image](https://user-images.githubusercontent.com/38674075/48247770-69defe00-e3a9-11e8-9aac-44269717bb93.png)
> *Newly created file downloaded file system specified in browser settings*

## Search:

Multiple forms of searching and sorting are supported, allowing users to find their files very quickly.
When a user inputs text into the 'Search' bar, all files that contain the input string from the search bar and will be rendered in the file list area. 

![image](https://user-images.githubusercontent.com/38674075/48247788-795e4700-e3a9-11e8-9c12-d652c14a14d8.png)
> *Files containing the string ‘DEM’ in their name are rendered in the list files area*

## Sort:
Fileshare can sort file lists five different ways by selecting the dropdown menu and selecting one of the following sort options:

* Most Recent 
* Least Recent 
* Alphabetic
* Reverse Alphabetic 
* File Size

Once a user selects an options, the files are reordered according to the selection.
In additon to sorting files, each file extension is categorized with a different color for visual representation of file types.

![image](https://user-images.githubusercontent.com/38674075/48247782-73686600-e3a9-11e8-844f-9b23c25ffdad.png)
> *Files are sorted from smallest to largest file size*  

## Ongoing Improvements
- Transition from a Single Page App using jQuery to use ReactJS:
*Requires replacing all jQuery with React Components and transitioning selectors into component lifecycle methods.*
- Allow users to preview text files:
*Change requires decision on how much of the file should be shared for multi-page files.* 
- Expand and restrict user files that can be uploaded: 
*First, decision of which files to restrict should be made, then conditions will be written to prevent upload of specific proprietary file types.
- Improve UX/UI Design
*Eventually flex files so two will appear in each row, add icons for file types.*
- Accommodate multiple Uploads/Downloads/Shared Files
*Add conditional statement for when a link for 'Upload Another File' is clicked, another file can be uploaded*
- Update Modal function declarations to use ES6 format
*Used function declarations to use $this function for simplicity in designing modal*
- Send confirmation email upon signup to prevent attackers from signing up for an account that does not belong to the user.
- Prevent user from uploading duplicate files
*Check to see if user already uploaded file with filename, if they have, send error message, otherwise, allow upload*
- Resolve page redirection refreshing issues upon inital login
*Will reslove when moved to React*
- Allow user to revoke access to shared files
*Create table to map UUID's and time shared with user. Allow user to see all generated UUID's and revoke access if desired*
### The following improvement ideas require further research: ###
- Support for editing files
- Add spell check to in browser text file creation
- Implement folder system 
- Public Hosting: FileShare is not publically hosted. To prepare for hosting, legal research into storing user files needs to be completed, along with functionallity changes to support a more significant user-base.
