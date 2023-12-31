#!/bin/bash

generate_password() {
  # Longueur du mot de passe
  LENGTH=12

  # Caractères possibles dans le mot de passe
  CHARACTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?"

  # Générer le mot de passe
  password=$(openssl rand -base64 48 | tr -d '/+=' | head -c $LENGTH)

  # Retourner le mot de passe
  echo "$password"
}

# Specify the path for the .env file
ENV_FILE=".env"

# Check if the .env file already exists
if [ -e "$ENV_FILE" ]; then
  echo ".env file already exists. Skipping creation."
else
  password=$(generate_password)
  # Create the .env file and add some example variables
  echo "TYPE=postgres" >> "$ENV_FILE"
  echo "HOST=database" >> "$ENV_FILE"
  echo "PORT=5432" >> "$ENV_FILE"
  echo "USERNAME=transcendence" >> "$ENV_FILE"
  echo "DATABASE_PASSWORD=$password" >> "$ENV_FILE"
  echo "DATABASE=postgres"  >> "$ENV_FILE"

  echo "POSTGRES_DB=postgres" >> "$ENV_FILE"
  echo "POSTGRES_USER=transcendence" >> "$ENV_FILE"
  echo "POSTGRES_PASSWORD=$password" >> "$ENV_FILE"

  echo "Created $ENV_FILE with example variables."
fi
