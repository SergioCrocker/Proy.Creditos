// evaluador.test.js
const { evaluarSolicitud } = require('./evaluador');

describe('evaluarSolicitud - rutas principales', () => {
  test('rechaza por mora activa', () => {
    const res = evaluarSolicitud({ moraActiva: true, score: 700 });
    expect(res).toEqual({ aprobado: false, razones: ['rechazo: mora activa'] });
  });

  test('rechaza por score < 600', () => {
    const res = evaluarSolicitud({ moraActiva: false, score: 599 });
    expect(res).toEqual({ aprobado: false, razones: ['rechazo: score < 600'] });
  });

  test('rechaza si no cumple reglas base (no estudiante)', () => {
    const res = evaluarSolicitud({
      score: 700,
      moraActiva: false,
      ingresosVerificados: false,
      dti: 40,
      perfil: 'empleado',
      antiguedadMeses: 12
    });
    expect(res.aprobado).toBe(false);
    expect(res.razones[0]).toMatch(/no cumple reglas base/);
  });

  test('estudiante con garante true (usa excepción) => aprobado', () => {
    const res = evaluarSolicitud({
      score: 640,
      moraActiva: false,
      ingresosVerificados: false,
      dti: 50,
      perfil: 'estudiante',
      garante: true
    });
    expect(res.aprobado).toBe(true);
  });

  test('estudiante con score >= 650 y reglas base cumplidas => aprobado', () => {
    const res = evaluarSolicitud({
      score: 650,
      moraActiva: false,
      ingresosVerificados: true,
      dti: 30,
      perfil: 'estudiante',
      garante: false
    });
    expect(res.aprobado).toBe(true);
  });

  test('empleado con antiguedad < 6 => rechazado', () => {
    const res = evaluarSolicitud({
      score: 660,
      moraActiva: false,
      ingresosVerificados: true,
      dti: 20,
      perfil: 'empleado',
      antiguedadMeses: 5
    });
    expect(res.aprobado).toBe(false);
    expect(res.razones[0]).toMatch(/empleado/);
  });

  test('empleado con antiguedad >=6 y score >=650 => aprobado', () => {
    const res = evaluarSolicitud({
      score: 650,
      moraActiva: false,
      ingresosVerificados: true,
      dti: 30,
      perfil: 'empleado',
      antiguedadMeses: 6
    });
    expect(res.aprobado).toBe(true);
  });

  test('independiente con antiguedad >=12 y score >=670 => aprobado', () => {
    const res = evaluarSolicitud({
      score: 670,
      moraActiva: false,
      ingresosVerificados: true,
      dti: 30,
      perfil: 'independiente',
      antiguedadMeses: 12
    });
    expect(res.aprobado).toBe(true);
  });

  test('retirado con score 640 => aprobado', () => {
    const res = evaluarSolicitud({
      score: 640,
      moraActiva: false,
      ingresosVerificados: true,
      dti: 20,
      perfil: 'retirado'
    });
    expect(res.aprobado).toBe(true);
  });
});
