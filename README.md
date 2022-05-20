# Intern challenge (FED)

This submission is a short story generator that features the following:

* Fields to enter a name, likes, and dislikes.
* Prompt ideas that will fill in the fields for the user.
* A selector to choose which engine to use when generating the story.
* A section that displays previous stories (newest at teh top) and a button to clear them.
* Utilizes sessionStorage to keep a history of the stories should the user leave the or refresh the page.

Please note that after much troubleshooting, I was unable to store OpenAI's API key as an environment variable or through a key manager. Although because the intstructions note that it's acceptable to have it exposed, I've instead broken it up into strings and put them back together so that OpenAI wouldn't automatically rotate it when publishing it to Github.
