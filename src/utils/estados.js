const ETIQUETAS_ESTADO = {
  Perfecto:     "Perfecto",
  Muy_bueno:    "Muy bueno",
  Bueno:        "Bueno",
  Aceptable:    "Aceptable",
  Para_reparar: "Para reparar",
};

export const etiquetaEstado = (valor) => ETIQUETAS_ESTADO[valor] ?? valor;