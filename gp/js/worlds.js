// Mapa de mundos (niveles) de cada área. "stage" indica en qué etapa del desarrollo se llena con ejercicios.
export const AREAS = {
  java: { name: 'Área 1 · Lógica y Java', icon: '☕', color: '#f59e0b', desc: 'Lógica de programación y programación en Java, de cero a POO.' },
  sql:  { name: 'Área 2 · SQL', icon: '🔎', color: '#38bdf8', desc: 'Del primer SELECT a consultas avanzadas con JOIN, subconsultas y vistas.' },
  db:   { name: 'Área 3 · Bases de datos', icon: '🗄️', color: '#a78bfa', desc: 'Modelado, claves, normalización, transacciones y triggers.' }
};

export const WORLDS = [
  // ÁREA 1
  { id: 'logic-1', area: 'java', name: 'Mundo 0 · Piensa como programador', desc: 'Algoritmos, pseudocódigo y seguimiento de código.', topics: ['Introducción a la programación', 'Algoritmos y pseudocódigo'], optional: true },
  { id: 'java-1', area: 'java', name: 'Mundo 1 · Primeros programas', desc: 'Variables, tipos, operadores, entrada/salida, if y ciclos básicos.', topics: ['Variables y constantes', 'Tipos de datos', 'Operadores', 'Entrada y salida', 'Condicionales', 'Ciclos'] },
  { id: 'java-2', area: 'java', name: 'Mundo 2 · Control del flujo', desc: 'switch, for/while/do-while en profundidad, patrones numéricos.', topics: ['switch', 'Ciclos anidados'], stage: 2 },
  { id: 'java-3', area: 'java', name: 'Mundo 3 · Métodos, arreglos y cadenas', desc: 'Métodos, arreglos, ArrayList y String.', topics: ['Métodos', 'Arreglos', 'ArrayList', 'Cadenas'], stage: 2 },
  { id: 'java-4', area: 'java', name: 'Mundo 4 · Clases y objetos', desc: 'Atributos, métodos, constructores y encapsulamiento.', topics: ['Clases', 'Constructores', 'Encapsulamiento'], stage: 3 },
  { id: 'java-5', area: 'java', name: 'Mundo 5 · POO avanzada', desc: 'Herencia, polimorfismo, abstracción e interfaces.', topics: ['Herencia', 'Polimorfismo', 'Interfaces'], stage: 3 },
  { id: 'java-6', area: 'java', name: 'Mundo 6 · Excepciones, archivos y colecciones', desc: 'try/catch, lectura/escritura, List, Set y Map.', topics: ['Excepciones', 'Archivos', 'Colecciones'], stage: 4 },
  { id: 'java-7', area: 'java', name: 'Mundo 7 · Mini proyectos', desc: 'Pequeños proyectos que integran todo.', topics: ['Proyectos'], stage: 4 },
  // ÁREA 2
  { id: 'sql-1', area: 'sql', name: 'Mundo 1 · Tablas y consultas básicas', desc: 'SELECT, WHERE, ORDER BY, DISTINCT, LIKE, BETWEEN, INSERT, UPDATE, DELETE.', topics: ['SELECT', 'WHERE', 'ORDER BY', 'DISTINCT', 'LIKE', 'AND/OR/NOT', 'INSERT', 'UPDATE', 'DELETE'] },
  { id: 'sql-2', area: 'sql', name: 'Mundo 2 · Funciones y agrupación', desc: 'IN, COUNT/SUM/AVG/MIN/MAX, GROUP BY, HAVING.', topics: ['IN', 'Funciones de agregación', 'GROUP BY', 'HAVING'], stage: 2 },
  { id: 'sql-3', area: 'sql', name: 'Mundo 3 · Varias tablas', desc: 'INNER/LEFT/RIGHT JOIN y consultas combinadas.', topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'UNION'], stage: 3 },
  { id: 'sql-4', area: 'sql', name: 'Mundo 4 · Subconsultas y vistas', desc: 'Subconsultas, vistas, índices.', topics: ['Subconsultas', 'Vistas', 'Índices'], stage: 4 },
  { id: 'sql-5', area: 'sql', name: 'Mundo 5 · Nivel avanzado', desc: 'Restricciones, validaciones y consultas avanzadas.', topics: ['Restricciones', 'Avanzado'], stage: 4 },
  // ÁREA 3
  { id: 'db-1', area: 'db', name: 'Mundo 1 · Tablas, claves y relaciones', desc: 'Crear tablas, PK, FK, relaciones 1:N y N:M, normalización, transacciones y triggers.', topics: ['Claves primarias', 'Claves foráneas', 'Relaciones', 'Normalización', 'Transacciones', 'Triggers'] },
  { id: 'db-2', area: 'db', name: 'Mundo 2 · Diseño de sistemas reales', desc: 'Modelo entidad-relación y diseño de bases completas.', topics: ['Modelo E-R', 'Diseño real'], stage: 3 },
  { id: 'db-3', area: 'db', name: 'Mundo 3 · Programación en la BD', desc: 'Procedimientos almacenados, índices, integridad.', topics: ['Procedimientos', 'Índices', 'Integridad referencial'], stage: 4 },
  { id: 'db-4', area: 'db', name: 'Mundo 4 · Java + BD (JDBC)', desc: 'Conexión JDBC y CRUD desde Java.', topics: ['JDBC', 'CRUD'], stage: 5 }
];

export const DIFFICULTY = {
  facil:   { label: 'Fácil',   xp: 10, color: '#22c55e' },
  medio:   { label: 'Medio',   xp: 25, color: '#f59e0b' },
  dificil: { label: 'Difícil', xp: 50, color: '#ef4444' }
};
