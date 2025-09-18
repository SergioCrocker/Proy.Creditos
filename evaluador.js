function evaluarSolicitud(solicitud = {}) {
  const razones = [];

  const {
    score = 0,
    moraActiva = false,
    ingresosVerificados = false,
    dti = Infinity,
    perfil = 'desconocido',
    antiguedadMeses = 0,
    garante = false,
  } = solicitud;

  // 1) Rechazo inmediato
  if (moraActiva) {
    razones.push('rechazo: mora activa');
    return { aprobado: false, razones };
  }
  if (score < 600) {
    razones.push('rechazo: score < 600');
    return { aprobado: false, razones };
  }

  // 2) Reglas base
  const cumpleReglasBase = ingresosVerificados === true && dti <= 35;
  // Excepción para estudiantes: pueden sustituir las reglas base con garante = true
  const cumpleBaseOExcepcion = cumpleReglasBase || (perfil === 'estudiante' && garante === true);

  if (!cumpleBaseOExcepcion) {
    razones.push('rechazo: no cumple reglas base (ingresos verificados y/o dti)');
    return { aprobado: false, razones };
  }

  // 3) Umbrales por perfil
  let aprobado = false;

  switch (perfil) {
    case 'estudiante':
      if (garante === true || score >= 650) {
        aprobado = true;
      } else {
        razones.push('rechazo: estudiante necesita garante o score >= 650');
      }
      break;

    case 'empleado':
      if (antiguedadMeses >= 6 && score >= 650) {
        aprobado = true;
      } else {
        razones.push('rechazo: empleado necesita antiguedad >= 6 y score >= 650');
      }
      break;

    case 'independiente':
      if (antiguedadMeses >= 12 && score >= 670) {
        aprobado = true;
      } else {
        razones.push('rechazo: independiente necesita antiguedad >= 12 y score >= 670');
      }
      break;

    case 'retirado':
      if (score >= 640) {
        aprobado = true;
      } else {
        razones.push('rechazo: retirado necesita score >= 640');
      }
      break;

    default:
      razones.push('rechazo: perfil desconocido');
  }

  return { aprobado, razones };
}

module.exports = { evaluarSolicitud };
