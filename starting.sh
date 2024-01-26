#!/bin/bash

generate_password() {
	LENGTH=42
	CHARACTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?"
	password=$(openssl rand -base64 48 | tr -d '/+=' | head -c $LENGTH)
	echo "$password"
}

ENV_FILE=".env"
ENV_FILE_DATABASE="database.env"
REACT_ENV="react.env"

if [ -e "$ENV_FILE" , "$ENV_FILE_DATABASE" , "$REACT_ENV" ]; then
  echo ".env file already exists. Skipping creation."
else
	password=$(generate_password)
	sessionEncrypt=$(generate_password)

	echo "POSTGRES_TYPE=postgres" >> "$ENV_FILE"
	echo "POSTGRES_HOST=database" >> "$ENV_FILE"
	echo "POSTGRES_PORT=5432" >> "$ENV_FILE"
	echo "POSTGRES_USERNAME=transcendence" >> "$ENV_FILE"
	echo "POSTGRES_DATABASE_PASSWORD=$password" >> "$ENV_FILE"
	echo "POSTGRES_DATABASE=postgres"  >> "$ENV_FILE"
	echo "PORT=3000" >> "$ENV_FILE"
	echo "HOSTNAME=$(hostname -s)" >> "$ENV_FILE"
	echo "API_CALLBACK=http://$(hostname -s):3000/api/auth/callback" >> "$ENV_FILE"
	echo "JWT_SECRET=$sessionEncrypt" >> "$ENV_FILE"

	echo "POSTGRES_DB=postgres" >> "$ENV_FILE_DATABASE"
	echo "POSTGRES_USER=transcendence" >> "$ENV_FILE_DATABASE"
	echo "POSTGRES_PASSWORD=$password" >> "$ENV_FILE_DATABASE"

	echo "REACT_APP_HOSTNAME=$(hostname -s)" >> "$REACT_ENV"
	echo "REACT_APP_PORT=3000" >> "$REACT_ENV"

	echo "Created $ENV_FILE with example variables."
 	echo "http://$(hostname -s):3000" > "url.txt"
fi


# # #!/bin/bash

# generate_password() {
#   # Longueur du mot de passe
#   LENGTH=42

#   # Caractères possibles dans le mot de passe
#   CHARACTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?"

#   # Générer le mot de passe
#   password=$(openssl rand -base64 48 | tr -d '/+=' | head -c $LENGTH)

#   # Retourner le mot de passe
#   echo "$password"
# }

# # Specify the path for the .env file
# ENV_FILE=".env"
# F_ENV_FILE="./frontend/.env"
# API_ENV_FILE="api.env"

# # Check if the .env file already exists
# if [ -e "$ENV_FILE" ]; then
#   echo ".env file already exists. Skipping creation."
# else
#   password=$(generate_password)
#   # Create the .env file and add some example variables
#   echo "TYPE=postgres" >> "$ENV_FILE"
#   echo "HOST=database" >> "$ENV_FILE"
#   echo "PORT=5432" >> "$ENV_FILE"
#   echo "USERNAME=transcendence" >> "$ENV_FILE"
#   echo "DATABASE_PASSWORD=$password" >> "$ENV_FILE"
#   echo "DATABASE=postgres"  >> "$ENV_FILE"

#   echo "POSTGRES_DB=postgres" >> "$ENV_FILE"
#   echo "POSTGRES_USER=transcendence" >> "$ENV_FILE"
#   echo "POSTGRES_PASSWORD=$password" >> "$ENV_FILE"

#   sessionEncrypt=$(generate_password)
#   echo "JWT_SECRET=$sessionEncrypt" >> "$ENV_FILE"

#   echo "HOSTNAME=$(hostname -s)" >> "$ENV_FILE"
#   echo "REACT_APP_HOSTNAME=$(hostname -s)" >> "$F_ENV_FILE"
#   API_CALLBACK=http://$(hostname -s):3030/auth/callback
#   echo "API_CALLBACK=$API_CALLBACK" >> "$ENV_FILE"

#   # Demandes pour API_ID et API_SECRET
#   read -p "Enter your API_ID: " api_id
#   read -p "Enter your API_SECRET: " api_secret
#   echo "API_ID=$api_id" >> "$API_ENV_FILE"
#   echo "API_SECRET=$api_secret" >> "$API_ENV_FILE"

#   echo "Created $ENV_FILE with example variables."
#   echo "http://$(hostname -s):3000" > "url.txt"
# fi