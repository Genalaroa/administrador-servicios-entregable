const socket = io();

socket.on("serviceCreated", (dato) => {

    const count = document.getElementById("services-count");

    if (!count) return;

    count.textContent = Number(count.textContent) + 1;
      
    const container = document.getElementById("services-list");

    container.insertAdjacentHTML("beforeend", `
    <article class="service" data-id="${dato._id}">
        <h3>${dato.name}</h3>
        <p>${dato.description}</p>
        <p>Duración: ${dato.duration} minutos</p>
        <p>Precio: ${dato.price} €</p>
        <p>Categoría: ${dato.category}</p>
        <p>Disponibilidad: ${dato.available ? "Disponible" : "No disponible"}</p>
    </article>
    `);
});

socket.on("serviceDeleted", (dato) => {
    const serviceCard = document.querySelector(
        `[data-id="${dato._id}"]`
    );

    if (serviceCard) {
        serviceCard.remove();

        const count = document.getElementById("services-count");
        if (count){
            count.textContent = Number(count.textContent) - 1;
        }
    }
});

socket.on("bookingCreated", (dato) => {

    const container = document.getElementById("bookings-list");

    if (!container) return;

    container.insertAdjacentHTML("beforeend", `
    <article class="booking" data-id="${dato._id}">
        <h3>${dato.clientName}</h3>
        <p>${dato.clientEmail}</p>
        <p>Fecha: ${dato.date}</p>
        <p>Hora: ${dato.time}</p>
        <p>Estado: ${dato.status}</p>

        <h4>Servicios contratados:</h4>
        <p>Sin servicios añadidos</p>
    </article>
    `);
});

socket.on("bookingUpdated", (dato) => {
    const bookingCard = document.querySelector(
        `[data-id="${dato._id}"]`
    );

    if (!bookingCard) return;

    bookingCard.innerHTML = `
    <h3>${dato.clientName}</h3>
    <p>Email: ${dato.clientEmail}</p>
    <p>Fecha: ${dato.date}</p>
    <p>Hora: ${dato.time}</p>
    <p>Estado: ${dato.status}</p>

    <h4>Servicios contratados:</h4>
    ${dato.services.map(item => `
        <p>
            Servicio: ${item.service.name}
            | Cantidad: ${item.quantity}
        </p>
    `).join("")}
`;

});
