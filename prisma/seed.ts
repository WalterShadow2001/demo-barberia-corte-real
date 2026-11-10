import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ??
        "file:/home/z/my-project/demos/demo-barberia-corte-real/db/barberia.db",
    },
  },
});

async function main() {
  console.log("Seeding Corte Real...");

  // --- Servicios ---
  const servicios = [
    { nombre: "Corte Clásico", descripcion: "Corte de tijera con estilo tradicional y acabado de navaja. Incluye lavado y peinado.", precio: 180, duracion: 30, categoria: "Cortes", icon: "scissors", destacado: true, orden: 1 },
    { nombre: "Corte & Barba", descripcion: "Corte completo más arreglo de barba con toalla caliente, aceites y contorno de navaja.", precio: 280, duracion: 45, categoria: "Cortes", icon: "scissors", destacado: true, orden: 2 },
    { nombre: "Fade / Degradado", descripcion: "Degradado perfecto con máquina y tijera. Transiciones limpias y diseño personalizado.", precio: 220, duracion: 40, categoria: "Cortes", icon: "scissors", destacado: false, orden: 3 },
    { nombre: "Diseño & Línea", descripcion: "Líneas y diseños personalizados con navaja. Arte sobre tu corte.", precio: 80, duracion: 20, categoria: "Detalles", icon: "sparkles", destacado: false, orden: 4 },
    { nombre: "Afeitado Clásico", descripcion: "Afeitado tradicional con navaja, toalla caliente y aceites premium.", precio: 150, duracion: 30, categoria: "Barba", icon: "razor", destacado: false, orden: 5 },
    { nombre: "Arreglo de Barba", descripcion: "Perfilado, recorte y tratamiento de barba con aceites esenciales.", precio: 120, duracion: 25, categoria: "Barba", icon: "razor", destacado: true, orden: 6 },
    { nombre: "Corte Infantil", descripcion: "Corte para niños hasta 12 años. Paciencia y buen ambiente garantizado.", precio: 130, duracion: 25, categoria: "Cortes", icon: "scissors", destacado: false, orden: 7 },
    { nombre: "Paquete Real", descripcion: "Corte + barba + lavado + facial express. La experiencia completa Corte Real.", precio: 480, duracion: 75, categoria: "Paquetes", icon: "crown", destacado: true, orden: 8 },
    { nombre: "Facial Premium", descripcion: "Limpieza facial profunda, mascarilla y masaje. Relájate mientras te cuidamos.", precio: 250, duracion: 40, categoria: "Cuidado", icon: "sparkles", destacado: false, orden: 9 },
    { nombre: "Color & Camuflaje", descripcion: "Coloración y camuflaje de canas con productos premium sin amoníaco.", precio: 300, duracion: 50, categoria: "Cuidado", icon: "sparkles", destacado: false, orden: 10 },
  ];

  for (const s of servicios) {
    await prisma.servicio.upsert({
      where: { id: `svc-${s.orden}` },
      update: s,
      create: { id: `svc-${s.orden}`, ...s },
    });
  }

  // --- Barberos ---
  const barberos = [
    { id: "barb-1", nombre: "Alejandro", apellidos: "Reyes", bio: "Maestro barbero con más de 15 años de experiencia. Especialista en cortes clásicos y degradados limpios.", especialidad: "Cortes clásicos & fades", experiencia: 15, foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", rating: 4.9, instagram: "@ale_barber" },
    { id: "barb-2", nombre: "Mauricio", apellidos: "Luna", bio: "Artista del diseño y la navaja. Crea líneas y diseños únicos en cada corte.", especialidad: "Diseños & navaja", experiencia: 8, foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", rating: 4.8, instagram: "@mau.cuts" },
    { id: "barb-3", nombre: "Daniel", apellidos: "Cortés", bio: "Experto en barbas y cuidado facial. Su tratamiento con toalla caliente es legendario.", especialidad: "Barba & afeitado clásico", experiencia: 12, foto: "https://images.unsplash.com/photo-1492562080023-ab3db95b191e?w=400&h=400&fit=crop", rating: 5.0, instagram: "@dan_the_barber" },
    { id: "barb-4", nombre: "Sebastián", apellidos: "Ríos", bio: "Joven talento con visión moderna. Fades, texturas y tendencias urbanas.", especialidad: "Urbano & texturas", experiencia: 5, foto: "https://images.unsplash.com/photo-1496346236646-50e98e672ac4?w=400&h=400&fit=crop", rating: 4.7, instagram: "@seba_fadez" },
  ];

  for (const b of barberos) {
    await prisma.barbero.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }

  // --- Horarios (Lunes a Sábado, Domingo cerrado) ---
  for (const b of barberos) {
    const dias = [1, 2, 3, 4, 5, 6]; // Lunes-Sábado
    for (const dia of dias) {
      const existing = await prisma.horario.findFirst({
        where: { barberoId: b.id, diaSemana: dia },
      });
      if (!existing) {
        await prisma.horario.create({
          data: {
            barberoId: b.id,
            diaSemana: dia,
            horaInicio: "10:00",
            horaFin: "20:00",
            activo: true,
          },
        });
      }
    }
  }

  // --- Testimonios ---
  const testimonios = [
    { nombre: "Carlos Mendoza", rating: 5, comentario: "El mejor corte de mi vida. Alejandro entendió exactamente lo que quería. Ambiente premium y trato real." },
    { nombre: "Javier Quintana", rating: 5, comentario: "El Paquete Real vale cada peso. Salí renovado, la atención y los aceites son de otro nivel." },
    { nombre: "Ricardo Flores", rating: 5, comentario: "Daniel es un crack con la barba. El afeitado clásico con toalla caliente es una experiencia que todos deben vivir." },
    { nombre: "Andrés Soto", rating: 4, comentario: "Mauricio me hizo un diseño increíble. Llegó a ser complicado pero quedó perfecto. Volveré seguro." },
    { nombre: "Manuel Vargas", rating: 5, comentario: "Llevo a mi hijo aquí desde hace 2 años. Paciencia infinita con los niños y cortes siempre pro." },
  ];

  for (const t of testimonios) {
    const existing = await prisma.testimonio.findFirst({ where: { nombre: t.nombre } });
    if (!existing) {
      await prisma.testimonio.create({ data: t });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
