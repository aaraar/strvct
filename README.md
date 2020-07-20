# strvct
Wallscope - Strvct

<kbd>![Shiny front-end](https://i.imgur.com/UpQK1Qu.png "Shiny front-end")</kbd>

## How to install
1. Clone repo
1. Install packages `yarn`
1. Add .env file with the following
    ```.env
    MONGODB_USER=
    MONGODB_PASSWORD=
    MONGODB_SERVER=
    ```
1. Run `yarn dev`
1. Go to localhost:3000

## Git workflow
- Create a feature branch with name i.e. `feature/searchButton`
- Add commits with a max of 2 functionalities per commit
- Create a `merge to develop` request when feature is done
- Ask for review
- Create a `merge develop to master` request when a milestone is in sight
- Ask all contributors for review
- Enjoy!
