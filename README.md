# strvct
Wallscope - Strvct

## How to install
1. Clone repo
1. Install packages `yarn`
1. Add .env file with the following
    ```.env
    MONGODB_USER=strvct-webdev-minor
    MONGODB_PASSWORD=sosD1ADt4joAKBQB
    MONGODB_SERVER=hva-calum.azure.mongodb.net
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
