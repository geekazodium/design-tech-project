# design tech project
Stephanie's design tech project
    
# Setup
Before continuing development, remember to ensure node modules are up to date
```
npm audit
```
## Visual Studio Code:

Go to  `run and debug`

select run configuration  `launch nodemon` and then start that configuration.

select run configuration  `open webpage` and then start that configuration.

the page should load, to see the progress with the rendering code, if you want you can download this from the branch `game-rendering` to navigate around to get a closer look at the block rendering.

the authentication currently does not have persistence, if you relaunch the program it will forget all saved passwords, I had enough of dealing with files in javascript.

there's probably still security issues with the current code, while using salted hashes to store the passwords makes it impractical to crack any password stored, I didn't take into consideration the security for other parts of the code.