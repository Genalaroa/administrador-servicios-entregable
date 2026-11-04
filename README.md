# Administrador de servicios
Este proyecto está desarrollado con Node.js, Express, MongoDB, Mongoose, Handlebars y Socket.io para gestionar servicios y reservas mediante una API REST y vistas dinámicas con actualización en tiempo real.

La API permite consultar, agregar, modificar y eliminar servicios, además de crear reservas y añadir servicios a las mismas.

Los datos se almacenan en MongoDB mediante Mongoose.

## Instalación
Para instalar las dependencias, ejecuta:

```bash
npm install
```

## Cómo ejecutar el proyecto

Primero, crea un archivo `.env` en la carpeta principal con estas variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=tu_uri_de_mongodb
```

Hay incluido un archivo `.env.example` como referencia.
Después, ejecuta:

```bash
npm start
```

El servidor se ejecuta en:
`http://localhost:8080`

## Arquitectura del proyecto

La aplicación utiliza una arquitectura por capas para separar responsabilidades:

- Routes (src/routes/): definen los endpoints y los conectan con los controllers.
- Controllers (src/controllers/): reciben las peticiones HTTP, gestionan los parámetros y devuelven las respuestas.
- Services (src/services/): contienen las reglas de negocio y validaciones.
- Repositories (src/repositories/): actúan como intermediarios entre los Services y los DAO.
- DAO (src/dao/): gestionan el acceso y la persistencia de los datos mediante Mongoose.

El flujo de la aplicación es:
Router → Controller → Service → Repository → DAO → Mongoose → MongoDB

Esta separación facilita el mantenimiento y permite cambiar el sistema de almacenamiento sin modificar las reglas de negocio.

## Estructura principal

src/
├── config/
│   ├── env.config.js
│   └── db.config.js
├── controllers/
│   ├── services.controller.js
│   ├── bookings.controller.js
│   └── views.controller.js
├── dao/
│   ├── services.dao.js
│   └── bookings.dao.js
├── models/
│   ├── service.model.js
│   ├── booking.model.js
│   └── message.model.js
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── socket.js
├── repositories/
│   ├── services.repository.js
│   └── bookings.repository.js
├── routes/
│   ├── services.router.js
│   ├── bookings.router.js
│   └── views.router.js
├── services/
│   ├── services.service.js
│   └── bookings.service.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── services.handlebars
│   └── bookings.handlebars
├── app.js
├── server.js
test/
  └── services.test.js

## Servicios
Los servicios se almacenan en MongoDB mediante el modelo Service.

Cada servicio tiene estos datos:

- _id: identificador del servicio.
- name: nombre.
- description: descripción.
- duration: duración.
- price: precio.
- category: categoría.
- available: indica si está disponible.

## Endpoints

### GET /api/services
Devuelve todos los servicios.

También permite filtrar por categoría y disponibilidad:

```
GET /api/services?category=Manicura
GET /api/services?available=true
```

### GET /api/services/:sid
Devuelve un servicio por su ID.

### POST /api/services
Crea un nuevo servicio. MongoDB genera automáticamente el identificador _id.

Ejemplo de body:

``` JSON
{
  "name": "Masaje relajante",
  "description": "Masaje corporal relajante",
  "duration": 60,
  "price": 45,
  "category": "Masajes",
  "available": true
}
```

### PUT /api/services/:sid
Actualiza un servicio existente. El ID no se puede modificar.

Ejemplo de body:

```JSON
{
  "price": 50,
  "available": false
}
```

### DELETE /api/services/:sid
Elimina un servicio por su ID.

## Reservas
Las reservas se almacenan en MongoDB mediante el modelo Booking.

Cada reserva contiene:

- _id: identificador de la reserva.
- clientName: nombre del cliente.
- clientEmail: correo electrónico del cliente.
- date: fecha de la reserva.
- time: hora de la reserva.
- status: estado de la reserva.
- services: servicios asociados a la reserva.

El campo services contiene referencias a documentos Service mediante ObjectId y una cantidad asociada a cada servicio.

## Endpoints de reservas

### POST /api/bookings
Crea una nueva reserva. El ID se genera automáticamente y la reserva comienza con el array `services` vacío.
Ejemplo de body:

```JSON
{
  "clientName": "Ana García",
  "clientEmail": "ana@email.com",
  "date": "2026-10-05",
  "time": "17:00",
  "status": "pending"
}
```

### GET /api/bookings/:bid
Devuelve una reserva por su ID.

### POST /api/bookings/:bid/services/:sid
Añade un servicio a una reserva existente.
Si el servicio todavía no está en la reserva, se añade con cantidad `1`.
Si el mismo servicio ya existe, se incrementa su cantidad.
Ejemplo:

POST /api/bookings/:bid/services/:sid


## Persistencia de datos

La aplicación utiliza MongoDB como sistema de almacenamiento y Mongoose para gestionar los modelos y las operaciones con la base de datos.

La conexión se configura mediante la variable de entorno MONGO_URI.

## Vistas con Handlebars

El proyecto utiliza Handlebars como motor de plantillas para generar vistas del lado del servidor.

Las vistas obtienen los datos desde MongoDB mediante las capas de servicios y repositorios.

Rutas disponibles:

- `GET /views/services`: muestra los servicios registrados.
- `GET /views/bookings`: muestra las reservas y los servicios asociados.

Se utiliza un layout principal compartido para mantener una estructura común entre las páginas.

## Comunicación en tiempo real con Socket.io

El proyecto utiliza Socket.io para actualizar las vistas automáticamente cuando se producen determinadas operaciones, sin necesidad de recargar la página.

Eventos implementados:

| Evento | Funcionalidad |
|---|---|
| `serviceCreated` | Añade un servicio a la vista |
| `serviceDeleted` | Elimina un servicio de la vista |
| `bookingCreated` | Añade una reserva a la vista |
| `bookingUpdated` | Actualiza una reserva cuando se le añade un servicio |

El servidor emite los eventos después de realizar correctamente las operaciones correspondientes.

El cliente escucha estos eventos mediante una conexión Socket.io y actualiza dinámicamente el contenido HTML.

## Tests
El proyecto utiliza el módulo de testing nativo de Node.js.

Los tests se ejecutan contra MongoDB y requieren una conexión válida. Algunas pruebas necesitan servicios registrados previamente en la base de datos.

Para ejecutar las pruebas:

```bash
npm test
```
Actualmente incluye 7 tests que comprueban:

- Que getServices() devuelve un array.
- Que getServiceById() devuelve un servicio existente.
- Que getServiceById() devuelve null si el servicio no existe.
- Que getServices() devuelve al menos un servicio.
- Que createService() rechaza precios negativos.
- Que createService() rechaza duraciones negativas.
- Que updateService() rechaza precios negativos.