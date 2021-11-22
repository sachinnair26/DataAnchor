# DataAnchor OneDrive Intigration 

Integrating One Drive with a nodejs backend 

## Features 

Encrypt the file as soon as file is created or updated using one drive Webhook

### Design 

- On initialization of the server delta request is made and result is saved in redis
- As soon as the file is created or updated the subscribed webhook is called 

- On webhook request delta request is again executed to get the latest change 

- Once the latest changes are fetched now we have to compare the older delta data from redis with the newer one and taking only those chages which belong to a particular folder

- Out of those files that are modified last are selected and encypted and saved back to the drive with the same file Id

- At last the delta request is again executed and updated delta is saved in the redis 

#### End Points 


1. '/createFile'

    Save File in the drive 


2. '/updateFile?id="File ID"'

    Save updated File


3. '/createdWebhook'


    Endpoint to handle webhook request
 



