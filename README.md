# ttjs
Tongue Tied as JS


### notes:

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
    
