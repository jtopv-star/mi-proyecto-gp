const mk = (n, o) => ({ id: 'db-' + String(n).padStart(3, '0'), area: 'db', world: 'db-1', ...o });

const AUTORES = `CREATE TABLE autores (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);
INSERT INTO autores (nombre) VALUES ('Gabriel García Márquez'), ('Isabel Allende');`;

const VENTAS = `CREATE TABLE ventas_planas (
  id SERIAL PRIMARY KEY, cliente TEXT, ciudad TEXT, producto TEXT, precio NUMERIC(8,2));
INSERT INTO ventas_planas (cliente, ciudad, producto, precio) VALUES
 ('Ana','Guatemala','Laptop',5500),('Ana','Guatemala','Mouse',85.5),
 ('Luis','Antigua','Teclado',220),('Marta','Mixco','Monitor',1450),('Luis','Antigua','Mouse',85.5);`;

const CUENTAS = `CREATE TABLE cuentas (id INT PRIMARY KEY, titular TEXT NOT NULL, saldo NUMERIC(10,2) NOT NULL CHECK (saldo >= 0));
INSERT INTO cuentas VALUES (1,'Ana',1000),(2,'Luis',300);`;

const PROD = `CREATE TABLE productos (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, precio NUMERIC(8,2) NOT NULL);
INSERT INTO productos (nombre, precio) VALUES ('Laptop', 5500), ('Mouse', 85.50);
CREATE TABLE auditoria (id SERIAL PRIMARY KEY, producto_id INT, precio_anterior NUMERIC(8,2), precio_nuevo NUMERIC(8,2));`;

export default [
  mk(1, { level: 'medio', topic: 'Claves primarias', title: 'Tu primera tabla bien diseñada',
    statement: 'Crea la tabla <code>estudiantes</code> con: <code>id</code> (entero autoincremental, <b>clave primaria</b>), <code>nombre</code> (<code>TEXT</code>, obligatorio) y <code>correo</code> (<code>TEXT</code>, <b>único</b>).',
    check: `SELECT 'col' AS k, column_name || ':' || data_type || ':' || is_nullable AS v FROM information_schema.columns WHERE table_schema='public' AND table_name='estudiantes'
UNION ALL SELECT 'con', constraint_type FROM information_schema.table_constraints WHERE table_schema='public' AND table_name='estudiantes' AND constraint_type IN ('PRIMARY KEY','UNIQUE');`,
    starter: '', solution: 'CREATE TABLE estudiantes (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, correo TEXT UNIQUE);',
    hints: ['<code>SERIAL</code> crea un entero que se autoincrementa.', 'Añade <code>PRIMARY KEY</code>, <code>NOT NULL</code> y <code>UNIQUE</code> a continuación del tipo de cada columna.'] }),
  mk(2, { level: 'medio', topic: 'Claves foráneas', title: 'Relación uno a muchos', setup: AUTORES,
    statement: 'Ya existe la tabla <code>autores</code> (un autor puede escribir muchos libros). Crea la tabla <code>libros</code> con <code>id</code> (clave primaria serial), <code>titulo</code> (<code>TEXT</code> obligatorio) y <code>autor_id</code> (entero) como <b>clave foránea</b> hacia <code>autores(id)</code>.',
    check: `SELECT 'col' AS k, column_name || ':' || data_type AS v FROM information_schema.columns WHERE table_schema='public' AND table_name='libros'
UNION ALL SELECT 'con', constraint_type FROM information_schema.table_constraints WHERE table_schema='public' AND table_name='libros' AND constraint_type IN ('PRIMARY KEY','FOREIGN KEY')
UNION ALL SELECT 'ref', confrelid::regclass::text FROM pg_constraint WHERE conrelid='public.libros'::regclass AND contype='f';`,
    starter: '', solution: 'CREATE TABLE libros (id SERIAL PRIMARY KEY, titulo TEXT NOT NULL, autor_id INT REFERENCES autores(id));',
    hints: ['En la relación 1:N, la clave foránea va en el lado “muchos” (libros).', '<code>autor_id INT REFERENCES autores(id)</code> declara la clave foránea.'] }),
  mk(3, { level: 'medio', topic: 'Integridad referencial', title: 'Borrado en cascada', setup: AUTORES,
    statement: 'Crea la tabla <code>comentarios</code> con <code>id</code> (serial, PK), <code>autor_id</code> (entero, FK hacia <code>autores(id)</code>) y <code>texto</code> (<code>TEXT</code>). Si se borra un autor, deben borrarse <b>automáticamente</b> sus comentarios.',
    check: `SELECT confdeltype::text AS al_borrar FROM pg_constraint WHERE conrelid='public.comentarios'::regclass AND contype='f';`,
    starter: '', solution: 'CREATE TABLE comentarios (id SERIAL PRIMARY KEY, autor_id INT REFERENCES autores(id) ON DELETE CASCADE, texto TEXT);',
    hints: ['Al final de la definición de la FK agrega una regla para el borrado.', '<code>ON DELETE CASCADE</code>'] }),
  mk(4, { level: 'medio', topic: 'Relaciones muchos a muchos', title: 'Tabla intermedia',
    setup: `CREATE TABLE alumnos (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);
CREATE TABLE cursos (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL);`,
    statement: 'Un alumno puede llevar muchos cursos y un curso tiene muchos alumnos. Crea la tabla intermedia <code>inscripciones</code> con <code>alumno_id</code> y <code>curso_id</code> (enteros). Cada uno es clave foránea hacia su tabla, y <b>la pareja</b> (alumno_id, curso_id) es la <b>clave primaria compuesta</b>.',
    check: `SELECT contype::text AS tipo, count(*)::int AS cuantas, max(array_length(conkey,1)) AS columnas FROM pg_constraint WHERE conrelid='public.inscripciones'::regclass AND contype IN ('f','p') GROUP BY contype;`,
    starter: '', solution: 'CREATE TABLE inscripciones (alumno_id INT REFERENCES alumnos(id), curso_id INT REFERENCES cursos(id), PRIMARY KEY (alumno_id, curso_id));',
    hints: ['Una PK compuesta se declara al final: <code>PRIMARY KEY (col1, col2)</code>.', 'Las dos FK se declaran con <code>REFERENCES</code> en cada columna.'] }),
  mk(5, { level: 'medio', topic: 'Normalización', title: 'Eliminar la repetición', setup: VENTAS,
    statement: 'La tabla <code>ventas_planas</code> repite el cliente y su ciudad en cada venta (viola la 2FN/3FN). Crea la tabla <code>clientes</code> con <code>id</code> (serial, PK), <code>nombre</code> y <code>ciudad</code>, y <b>llénala</b> con cada cliente distinto usando <code>INSERT ... SELECT DISTINCT</code>.',
    check: 'SELECT nombre, ciudad FROM clientes;',
    starter: '', solution: 'CREATE TABLE clientes (id SERIAL PRIMARY KEY, nombre TEXT, ciudad TEXT);\nINSERT INTO clientes (nombre, ciudad) SELECT DISTINCT cliente, ciudad FROM ventas_planas;',
    hints: ['Primero <code>CREATE TABLE clientes (...)</code>, luego el INSERT.', '<code>INSERT INTO clientes (nombre, ciudad) SELECT DISTINCT cliente, ciudad FROM ventas_planas;</code>'] }),
  mk(6, { level: 'medio', topic: 'Transacciones', title: 'Transferencia segura', setup: CUENTAS,
    statement: 'Transfiere <b>500</b> de la cuenta 1 a la cuenta 2 dentro de una <b>transacción</b>: abre con <code>BEGIN</code>, resta a la cuenta 1, suma a la cuenta 2 y termina con <code>COMMIT</code>.',
    check: 'SELECT id, saldo FROM cuentas ORDER BY id;',
    starter: '', solution: 'BEGIN;\nUPDATE cuentas SET saldo = saldo - 500 WHERE id = 1;\nUPDATE cuentas SET saldo = saldo + 500 WHERE id = 2;\nCOMMIT;',
    hints: ['Una transacción agrupa varias instrucciones: o se aplican todas o ninguna.', 'Estructura: <code>BEGIN; UPDATE...; UPDATE...; COMMIT;</code>'] }),
  mk(7, { level: 'dificil', topic: 'Triggers', title: 'Auditoría automática con trigger', setup: PROD,
    statement: 'Cada vez que cambie el <code>precio</code> de un producto, se debe guardar una fila en <code>auditoria</code> (producto_id, precio_anterior, precio_nuevo). Crea la <b>función</b> trigger en PL/pgSQL y el <b>trigger</b> <code>AFTER UPDATE</code> sobre <code>productos</code>.<br><small>Pista de sintaxis: en PostgreSQL el cuerpo de la función va entre <code>$$ ... $$</code> y las variables especiales son <code>OLD</code> y <code>NEW</code>.</small>',
    check: `UPDATE productos SET precio = 5000 WHERE id = 1;
UPDATE productos SET nombre = 'Mouse inalámbrico' WHERE id = 2;
SELECT producto_id, precio_anterior, precio_nuevo FROM auditoria;`,
    starter: '-- 1) La función\nCREATE OR REPLACE FUNCTION registrar_cambio_precio() RETURNS TRIGGER AS $$\nBEGIN\n  -- tu código\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\n-- 2) El trigger\n',
    solution: `CREATE OR REPLACE FUNCTION registrar_cambio_precio() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.precio <> OLD.precio THEN
    INSERT INTO auditoria (producto_id, precio_anterior, precio_nuevo) VALUES (OLD.id, OLD.precio, NEW.precio);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_precio AFTER UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION registrar_cambio_precio();`,
    hints: ['Dentro de la función compara <code>NEW.precio</code> con <code>OLD.precio</code> para no auditar cambios de otras columnas.', 'Usa <code>INSERT INTO auditoria ... VALUES (OLD.id, OLD.precio, NEW.precio)</code>.', 'El trigger: <code>CREATE TRIGGER nombre AFTER UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION registrar_cambio_precio();</code>'] })
];
