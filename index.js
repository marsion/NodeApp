const config = require('config');
const app = require('./app');
const socket = require('./modules/socket');

const port = config.port;

const server = app.listen(port, () => {
    console.log(`********* Server is listening on port: ${port}`);
});

socket(server);
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCzMepIyQhWiNcazpFYleUx9qsPXqMNLZPwRCgIo4bGLOg3hR/DqnhlGOWhnK7YhoIujbPSpgu+HlwDR3HUbKnRHT6CdhJKdOr/G4q7slU6pVT5Yd4YDvynO5HWdi6l7sEERVdgTiXlpCSGs3OLYRICwNtAEzhEgDAOSMhaIqZStxznbOZpRWcgcPg9ZOcz47CS72xYWrrvD0DXg4LxVoauHUKCqxw7WYQvqREmt3IuHVi0gw/955mNbvv8K+itPzN5Jk4QizKU+o/Dn5XFHSeU3VJhUVjkidQ3E1Dqg9Vj4rFGueI51m6KMQNZZVbJM4Nssu6GEK2tUWuutc/JaQQdgruVyyH6q9P1mh9UgSXhM+H+lDeIsu3x+LUKG5eD3pkYIdqwjCwNIkRsgkVCGAB00BCutmyaMIbURaUdXmpKzPQqFZAZa8BRYfHlb6YFqbBXHiW3BMv24ao06ZSGkZshBa58GTgCTjn+CaU57gxaeG0DkME5luml7jlHYsMrl8TvVInjdztA3Ogi0poZhoPyB++s2BSo42zFHpYVEuwnomUnuSQmtur3yrGs4UiZgQlMfyzPnrZwGBrUR89gygjQ0brD+RxedE8VdynoNNeawIGPA0o0vkPD/v1VWF0YrFb+kw5WtRqsBLmH6lPHzQja4yKkt+EnC9NWp1xAhu+KiQ== Codacy account public key
