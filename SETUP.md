# Guía de Configuración Rápida

## Pasos para empezar

### 1. Iniciar Docker Desktop
Asegúrate de que Docker Desktop esté corriendo en tu Mac. Si no lo tienes instalado:
- Descárgalo desde: https://www.docker.com/products/docker-desktop/

### 2. Iniciar la base de datos
```bash
npm run db:up
```

Esto iniciará PostgreSQL en un contenedor Docker.

### 3. Configurar Prisma
```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push
```

### 4. Ver los datos (Opcional pero recomendado)
```bash
npm run db:studio
```

Esto abrirá Prisma Studio en `http://localhost:5555` donde podrás ver todos tus datos de forma visual.

### 5. Iniciar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Ver los cambios en la base de datos

### Prisma Studio (Recomendado)
```bash
npm run db:studio
```
- Abre `http://localhost:5555`
- Puedes ver, editar y crear datos visualmente
- Se actualiza en tiempo real

### Comandos útiles

```bash
# Detener la base de datos
npm run db:down

# Reiniciar la base de datos
npm run db:down && npm run db:up

# Resetear la base de datos (elimina todos los datos)
npm run db:reset
```

## Solución de problemas

### "Cannot connect to the Docker daemon"
- Asegúrate de que Docker Desktop esté corriendo
- Verifica con: `docker ps`

### "Error: connect ECONNREFUSED"
- Verifica que la base de datos esté corriendo: `docker ps`
- Verifica que `.env` tenga la `DATABASE_URL` correcta

### Ver logs de la base de datos
```bash
docker logs finance-app-db
```

