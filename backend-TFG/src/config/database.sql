-- Verificar si la columna ya existe y añadirla si no existe
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT 'default-profile.png';

-- Actualizar registros existentes que tengan NULL
UPDATE users 
SET profile_picture = 'default-profile.png' 
WHERE profile_picture IS NULL; 