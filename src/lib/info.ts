export const BARBERIA_INFO = {
  nombre: "Corte Real",
  lema: "El arte de cortar bien",
  direccion: "Av. Reforma 425, Centro, Delicias, Chihuahua, MX",
  telefono: "(639) 472 0099",
  telefonoHref: "tel:+526394720099",
  email: "hola@cortereal.mx",
  horario: [
    { dia: "Lunes", horas: "10:00 – 20:00" },
    { dia: "Martes", horas: "10:00 – 20:00" },
    { dia: "Miércoles", horas: "10:00 – 20:00" },
    { dia: "Jueves", horas: "10:00 – 20:00" },
    { dia: "Viernes", horas: "10:00 – 20:00" },
    { dia: "Sábado", horas: "10:00 – 20:00" },
    { dia: "Domingo", horas: "Cerrado" },
  ],
  redes: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
};

/** Horarios en slots de 30 min para reservas (10:00 a 20:00) */
export const TIME_SLOTS: string[] = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30",
];

export const DIAS_SEMANA = [
  "Domingo", "Lunes", "Martes", "Miércoles",
  "Jueves", "Viernes", "Sábado",
];
