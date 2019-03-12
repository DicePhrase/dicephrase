# Building DicePhrase

 DicePhrase's Help page in the `doc` directory needs to be built using Jekyll. Also, the Firefox extension needs to be packaged with Web-ext.

1. Install [Jekyll](https://jekyllrb.com/):
    ```
    gem install jekyll
    ```
2. Install [Web-ext](https://www.npmjs.com/package/web-ext):
    ```
    npm install --global web-ext
    ```
3. Clone the repository:
    ```
    git clone https://github.com/dicephrase/dicephrase.git
    cd dicephrase
    ```
4. Run the build script:
    ```
    ./build.sh
    ```
5. Packaged files will be located in the 'pkg' directory.
