# ttjs
Tongue Tied as JS


### notes:

starting server:
- start mongo in terminal
    mongod
- in another terminal
    nvm use
    foreman run npm run start


mocha watch command:

    foreman run npm run mocha-watch
    
alternate to above:

    npm install nodemon -g

and then:

    nodemon -w . -d 0 --exec foreman run npm run mocha

these were the codeship setup commands prior to making it a JS project...

    rvm use ruby-2.2.0
    bundle install
    export FOO=bar
    export PLIVO_AUTHID=uh_no
    export PLIVO_TOKEN=nill
    export PLIVO_PHONE_NUMBER=18005551212
    export DB_HOST=localhost
    export DB_NAME=test

and these were the codeship test commands....

    psql -c 'create database tongue_tied_test;'
    rvm use ruby-2.2.0
    bundle exec rake
    # bundle exec rake
    # bundle exec rake test
    # bundle exec rspec
    
To update the environment configs (specifically the text message responses that may have issues with unix escaping) - do it interactively from the .env file...

     heroku config:push -i
     
Now investigating Heroku addon [temporize](https://devcenter.heroku.com/articles/temporize#basic-concepts): `heroku addons:create temporize` - 

To import the data from my old system I didn't have luck using a CSV file. Instead, I created a JSON file from the CSV [using this site](http://www.csvjson.com/csv2json) and ran this command...

    mongoimport -h <MONGOLABDB>.mongolab.com:47752 -d <DATABASE NAME> -c phones -u <USER> -p <PASSS> --file subscribers.json --jsonArray
    
the JSON file was formated like this:

    [
      {
        "number": 1111111111,
        "active": "TRUE"
      },
      {
        "number": 2222222222,
        "active": "TRUE"
      },
      .
      .
      .
      {
        "number": 3333333333,
        "active": "TRUE"
      }
  
    ]

