# Code Examples

## Angular 
### service.ts

The universal code to work with API servers. The ServiceBase is base class implemented to work with APIs and handle responses from any server. Children classes look like PartnerService, where we set interface for data, method, and URL for any request. This approach significantly reduces the time of development every next service for the API.

## Django
### models.py

Code Django models with the implementation of relations OneToOne through ForeignKey to implement universal content articles.
The news model contains only the title, picture, date and time of creation, the author. The content of the news contains in the blocks of news. Each block can contain one or all of the filled-in fields. Depending on how full it is, it changes the visual presentation in the template. For example, the text is wrapped around the pictures if it exists or picture is displayed in full screen if the text is missing. In turn, the video is always displayed in full screen and etc.

## Node
### node routes

Universal system for determining the route system


## SASS

Some examples for sass and files structure 
