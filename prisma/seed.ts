// prisma/seed.ts — Seeds the Turso DB with services, barbers, schedules,
// testimonials and sample reservations.
import { createClient } from "@libsql/client";

function env(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env var ${k}`);
  return v;
}

const client = createClient({
  url: env("TURSO_DATABASE_URL"),
  authToken: env("TURSO_AUTH_TOKEN"),
});

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

function cuidLike(prefix = "c"): string {
  return (
    prefix +
    Math.random().toString(36).slice(2, 12) +
    Date.now().toString(36).slice(-6)
  );
}

type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMin: number;
  icono: string;
};

type Barbero = {
  id: string;
  nombre: string;
  foto: string;
  especialidad: string;
  rating: number;
  activo: boolean;
};

const SERVICIOS: Servicio[] = [
  {
    id: "svc-clasico",
    nombre: "Corte clásico",
    descripcion:
      "Corte tradicional con tijera y máquina. Estilo limpio y atemporal para todas las edades.",
    precio: 250,
    duracionMin: 30,
    icono: "✂️",
  },
  {
    id: "svc-fade",
    nombre: "Fade / degradado",
    descripcion:
      "Degradado profesional con transiciones suaves. El corte más pedido en la barbería moderna.",
    precio: 350,
    duracionMin: 45,
    icono: "🎯",
  },
  {
    id: "svc-ceja",
    nombre: "Diseño de ceja",
    descripcion:
      "Perfilado y diseño de ceja con navaja y pinzas. Acentúa tu mirada en minutos.",
    precio: 80,
    duracionMin: 15,
    icono: "✨",
  },
  {
    id: "svc-barba",
    nombre: "Arreglo de barba",
    descripcion:
      "Perfilado, recorte y diseño de barba con navaja y toalla caliente. Para que luzcas impecable.",
    precio: 200,
    duracionMin: 25,
    icono: "🧔",
  },
  {
    id: "svc-paquete",
    nombre: "Paquete completo",
    descripcion:
      "Corte + barba + cejas. La experiencia completa para salir renovado de pies a cabeza.",
    precio: 550,
    duracionMin: 75,
    icono: "👑",
  },
  {
    id: "svc-nino",
    nombre: "Corte niño",
    descripcion:
      "Cortes para los más pequeños de la casa. Paciencia y un buen acabado para que salgan felices.",
    precio: 180,
    duracionMin: 20,
    icono: "🧒",
  },
];

const BARBEROS: Barbero[] = [
  {
    id: "brb-carlos",
    nombre: "Carlos Mendoza",
    foto: "CM",
    especialidad: "Fades y diseños",
    rating: 4.9,
    activo: true,
  },
  {
    id: "brb-miguel",
    nombre: "Miguel Ángel Torres",
    foto: "MT",
    especialidad: "Cortes clásicos y barbas",
    rating: 4.8,
    activo: true,
  },
  {
    id: "brb-alejandro",
    nombre: "Alejandro Ruiz",
    foto: "AR",
    especialidad: "Diseños creativos",
    rating: 4.7,
    activo: true,
  },
  {
    id: "brb-javier",
    nombre: "Javier Hernández",
    foto: "JH",
    especialidad: "Cortes infantiles",
    rating: 5.0,
    activo: true,
  },
];

// Horarios for each barber: Lun-Vie (1-5) 10-14 y 16-20; Sab (6) 10-14.
const DIAS_LUN_VIE = [1, 2, 3, 4, 5];
const HORARIOS_LUN_VIE = [
  { horaInicio: "10:00", horaFin: "14:00" },
  { horaInicio: "16:00", horaFin: "20:00" },
];
const HORARIO_SAB = [{ horaInicio: "10:00", horaFin: "14:00" }];

type Testimonio = {
  id: string;
  autor: string;
  texto: string;
  rating: number;
  aprobado: boolean;
};

const TESTIMONIOS: Testimonio[] = [
  {
    id: "tst-1",
    autor: "Juan Pérez",
    texto:
      "El mejor fade que me han hecho en Delicias. Carlos entendió exactamente lo que quería. Llevo 6 meses yendo y nunca me falla.",
    rating: 5,
    aprobado: true,
  },
  {
    id: "tst-2",
    autor: "Luis Gómez",
    texto:
      "Ambiente padrísimo, música buena y atención de primera. Miguel me arregló la barba con navaja como Dios manda.",
    rating: 5,
    aprobado: true,
  },
  {
    id: "tst-3",
    autor: "Roberto Fierro",
    texto:
      "Llevé a mi hijo de 6 años y Javier lo dejó contento. Volvió pidiendo regresar. 100% recomendado para los pequeños.",
    rating: 5,
    aprobado: true,
  },
  {
    id: "tst-4",
    autor: "Andrea Chávez",
    texto:
      "Reservé en línea en 2 minutos y a la hora exacta estaba en la silla. El paquete completo valió cada peso.",
    rating: 5,
    aprobado: true,
  },
  {
    id: "tst-5",
    autor: "Miguel Armendáriz",
    texto:
      "Alejandro me hizo un diseño creativo en el corte que quería para una boda. Quedó increíble y todos preguntaron dónde lo hice.",
    rating: 5,
    aprobado: true,
  },
  {
    id: "tst-6",
    autor: "Pedro Nevárez",
    texto:
      "Buen servicio aunque tuve que esperar unos minutos de más. El corte quedó bien al final.",
    rating: 4,
    aprobado: false,
  },
  {
    id: "tst-7",
    autor: "Sofía Quiñones",
    texto:
      "Me pareció caro para lo que pedí, pero el acabado sí es de calidad. Volveré a probar el fade la próxima.",
    rating: 4,
    aprobado: false,
  },
  {
    id: "tst-8",
    autor: "Diego Mata",
    texto:
      "Recomendado por un amigo. La verdad me sorprendió el nivel de detalle. Carlos se gana las 5 estrellas.",
    rating: 5,
    aprobado: false,
  },
];

type ReservaSeed = {
  id: string;
  clienteNombre: string;
  clientePhone: string;
  barberoId: string;
  servicioId: string;
  fecha: string;
  hora: string;
  estado: string;
  creadoEn: string;
};

const RESERVAS: ReservaSeed[] = [
  {
    id: "res-1",
    clienteNombre: "Héctor Salas",
    clientePhone: "6391234567",
    barberoId: "brb-carlos",
    servicioId: "svc-fade",
    fecha: todayISO(0),
    hora: "11:00",
    estado: "pendiente",
    creadoEn: new Date().toISOString(),
  },
  {
    id: "res-2",
    clienteNombre: "Martín Ríos",
    clientePhone: "6397654321",
    barberoId: "brb-miguel",
    servicioId: "svc-paquete",
    fecha: todayISO(0),
    hora: "17:00",
    estado: "pendiente",
    creadoEn: new Date().toISOString(),
  },
  {
    id: "res-3",
    clienteNombre: "Ángel Bustamante",
    clientePhone: "6398881212",
    barberoId: "brb-alejandro",
    servicioId: "svc-clasico",
    fecha: todayISO(1),
    hora: "12:00",
    estado: "pendiente",
    creadoEn: new Date().toISOString(),
  },
  {
    id: "res-4",
    clienteNombre: "Sergio Garza",
    clientePhone: "6394445566",
    barberoId: "brb-javier",
    servicioId: "svc-nino",
    fecha: todayISO(1),
    hora: "11:30",
    estado: "pendiente",
    creadoEn: new Date().toISOString(),
  },
  {
    id: "res-5",
    clienteNombre: "Fernando Aguirre",
    clientePhone: "6392223344",
    barberoId: "brb-carlos",
    servicioId: "svc-barba",
    fecha: todayISO(-1),
    hora: "16:00",
    estado: "completada",
    creadoEn: new Date(Date.now() - 86400000).toISOString(),
  },
];

async function exec(sql: string, args: unknown[] = []) {
  try {
    await client.execute({ sql, args });
  } catch (e) {
    console.error("SQL error:", sql, args, e);
    throw e;
  }
}

async function main() {
  console.log("Cleaning tables...");
  await exec(`DELETE FROM "Reserva"`);
  await exec(`DELETE FROM "HorarioBarbero"`);
  await exec(`DELETE FROM "Testimonio"`);
  await exec(`DELETE FROM "Barbero"`);
  await exec(`DELETE FROM "Servicio"`);

  console.log("Inserting services...");
  for (const s of SERVICIOS) {
    await exec(
      `INSERT INTO "Servicio" ("id","nombre","descripcion","precio","duracionMin","icono") VALUES (?,?,?,?,?,?)`,
      [s.id, s.nombre, s.descripcion, s.precio, s.duracionMin, s.icono]
    );
  }

  console.log("Inserting barbers + schedules...");
  for (const b of BARBEROS) {
    await exec(
      `INSERT INTO "Barbero" ("id","nombre","foto","especialidad","rating","activo") VALUES (?,?,?,?,?,?)`,
      [b.id, b.nombre, b.foto, b.especialidad, b.rating, b.activo ? 1 : 0]
    );
    // Lun-Vie horarios
    for (const dia of DIAS_LUN_VIE) {
      for (const h of HORARIOS_LUN_VIE) {
        await exec(
          `INSERT INTO "HorarioBarbero" ("id","barberoId","diaSemana","horaInicio","horaFin") VALUES (?,?,?,?,?)`,
          [cuidLike("h"), b.id, dia, h.horaInicio, h.horaFin]
        );
      }
    }
    // Sabado
    for (const h of HORARIO_SAB) {
      await exec(
        `INSERT INTO "HorarioBarbero" ("id","barberoId","diaSemana","horaInicio","horaFin") VALUES (?,?,?,?,?)`,
        [cuidLike("h"), b.id, 6, h.horaInicio, h.horaFin]
      );
    }
  }

  console.log("Inserting testimonials...");
  for (const t of TESTIMONIOS) {
    await exec(
      `INSERT INTO "Testimonio" ("id","autor","texto","rating","aprobado") VALUES (?,?,?,?,?)`,
      [t.id, t.autor, t.texto, t.rating, t.aprobado ? 1 : 0]
    );
  }

  console.log("Inserting reservations...");
  for (const r of RESERVAS) {
    await exec(
      `INSERT INTO "Reserva" ("id","clienteNombre","clientePhone","barberoId","servicioId","fecha","hora","estado","creadoEn") VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        r.id,
        r.clienteNombre,
        r.clientePhone,
        r.barberoId,
        r.servicioId,
        r.fecha,
        r.hora,
        r.estado,
        r.creadoEn,
      ]
    );
  }

  // Summary
  const counts = await Promise.all([
    client.execute(`SELECT COUNT(*) as c FROM "Servicio"`),
    client.execute(`SELECT COUNT(*) as c FROM "Barbero"`),
    client.execute(`SELECT COUNT(*) as c FROM "HorarioBarbero"`),
    client.execute(`SELECT COUNT(*) as c FROM "Reserva"`),
    client.execute(`SELECT COUNT(*) as c FROM "Testimonio"`),
  ]);
  console.log(
    `Servicios: ${counts[0].rows[0].c}, Barberos: ${counts[1].rows[0].c}, Horarios: ${counts[2].rows[0].c}, Reservas: ${counts[3].rows[0].c}, Testimonios: ${counts[4].rows[0].c}`
  );
}

main()
  .then(() => {
    console.log("Seed complete ✓");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
