#!/bin/bash

# --- 1️⃣ Parámetros fijos ---
DB_USER="root"
DB_HOST="localhost"
DB_PORT=3306

# --- 2️⃣ Solicitar datos por consola ---
read -s -p "Introduce la contraseña de MariaDB root: " DB_PASS
echo ""
read -p "Nombre de la base de datos a crear: " DB_NAME

# --- 3️⃣ Crear la base de datos ---
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e \
"CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "Base de datos '$DB_NAME' creada (si no existía)."

# --- 4️⃣ Crear tablas ---
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin','cliente') NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero CHAR(4) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    carpeta_base VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    empresa_id INT NOT NULL,
    subcarpeta VARCHAR(255),
    rol ENUM('lector','editor') DEFAULT 'lector',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    empresa_id INT,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT,
    ip VARCHAR(45),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);
EOF

echo "Tablas creadas correctamente."

# --- 5️⃣ Crear primer usuario admin ---
echo "Introduce los datos del primer usuario admin:"
read -p "Username: " ADMIN_USER
read -p "Email: " ADMIN_EMAIL
read -s -p "Contraseña: " ADMIN_PASS
echo ""

# --- 6️⃣ Insertar usuario admin con bcrypt ---
python3 - <<END
import pymysql
import bcrypt

conn = pymysql.connect(
    host='$DB_HOST',
    port=$DB_PORT,
    user='$DB_USER',
    password='$DB_PASS',
    database='$DB_NAME'
)
cursor = conn.cursor()

hashed_pw = bcrypt.hashpw('$ADMIN_PASS'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

cursor.execute(
    "INSERT INTO users (username, email, password_hash, rol, activo) VALUES (%s, %s, %s, 'admin', TRUE)",
    ('$ADMIN_USER', '$ADMIN_EMAIL', hashed_pw)
)

conn.commit()
cursor.close()
conn.close()

print("Usuario admin creado correctamente.")
END
