import { r, SC, NOSC, mkJ, T } from './_java.js';
const mk = mkJ('java-2');

export default [
  mk(13, { level: 'facil', topic: 'switch', title: 'Dia de la semana',
    statement: 'Lee un numero del 1 al 7 y, con <code>switch</code>, imprime el dia: 1 = <code>Lunes</code>, 2 = <code>Martes</code>, 3 = <code>Miercoles</code>, 4 = <code>Jueves</code>, 5 = <code>Viernes</code>, 6 = <code>Sabado</code>, 7 = <code>Domingo</code>. Cualquier otro numero imprime <code>Dia invalido</code>. <small>(Escribe los textos sin tildes.)</small>',
    starter: SC('int d = sc.nextInt();\n        // switch (d) { ... }'),
    solution: r`import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt();
        switch (d) {
            case 1: System.out.println("Lunes"); break;
            case 2: System.out.println("Martes"); break;
            case 3: System.out.println("Miercoles"); break;
            case 4: System.out.println("Jueves"); break;
            case 5: System.out.println("Viernes"); break;
            case 6: System.out.println("Sabado"); break;
            case 7: System.out.println("Domingo"); break;
            default: System.out.println("Dia invalido");
        }
    }
}
`,
    tests: [T('1\n'), T('4\n'), T('7\n'), T('0\n'), T('9\n')],
    hints: ['<code>switch (d) { case 1: ...; break; case 2: ...; break; default: ... }</code>', 'No olvides el <code>break;</code> al final de cada caso o seguira ejecutando el siguiente.', '<code>default</code> cubre todo lo que no coincide con ningun caso.'] }),

  mk(14, { level: 'facil', topic: 'Ciclos', title: 'Cuenta regresiva',
    statement: 'Usa un ciclo <code>do-while</code> para imprimir la cuenta regresiva del <b>5 al 1</b>, un numero por linea, y al final la palabra <code>Despegue</code>.',
    starter: NOSC('int n = 5;\n        // do { ... } while (...);'),
    solution: NOSC('int n = 5;\n        do {\n            System.out.println(n);\n            n--;\n        } while (n >= 1);\n        System.out.println("Despegue");'),
    tests: [T('', '5\n4\n3\n2\n1\nDespegue')],
    hints: ['<code>do { ... } while (condicion);</code> ejecuta el bloque al menos una vez y luego revisa la condicion.', 'Imprime <code>n</code> y despues haz <code>n--;</code>. Repite mientras <code>n &gt;= 1</code>.'] }),

  mk(15, { level: 'medio', topic: 'switch', title: 'Calculadora simple',
    statement: 'Lee un entero, un operador (<code>+ - * /</code>) y otro entero, separados por espacios. Imprime el resultado. Si el operador es <code>/</code> y el divisor es 0 imprime <code>Error: division entre cero</code>. Si el operador no existe imprime <code>Operador invalido</code>. La division es entera.<br><small>Ejemplo: <code>8 + 2</code> → <code>10</code></small>',
    starter: SC('int a = sc.nextInt();\n        char op = sc.next().charAt(0);\n        int b = sc.nextInt();\n        '),
    solution: SC('int a = sc.nextInt();\n        char op = sc.next().charAt(0);\n        int b = sc.nextInt();\n        switch (op) {\n            case \'+\': System.out.println(a + b); break;\n            case \'-\': System.out.println(a - b); break;\n            case \'*\': System.out.println(a * b); break;\n            case \'/\':\n                if (b == 0) System.out.println("Error: division entre cero");\n                else System.out.println(a / b);\n                break;\n            default: System.out.println("Operador invalido");\n        }'),
    tests: [T('8 + 2\n'), T('8 - 12\n'), T('7 * 6\n'), T('17 / 5\n'), T('5 / 0\n'), T('4 % 2\n')],
    hints: ['<code>sc.next().charAt(0)</code> lee una palabra y se queda con su primer caracter.', 'Puedes usar <code>switch</code> sobre un <code>char</code>: <code>case \'+\':</code>', 'Dentro del caso <code>\'/\'</code> necesitas un <code>if</code> para el divisor 0.'] }),

  mk(16, { level: 'medio', topic: 'Ciclos', title: 'Leer hasta el cero',
    statement: 'Lee enteros hasta que llegue un <code>0</code> (el 0 no cuenta). Imprime en una linea la <b>cantidad</b> de numeros leidos y en otra la <b>suma</b>, con el formato:<pre>Cantidad: 3\nSuma: 16</pre>',
    starter: SC('// usa while o do-while'),
    solution: SC('int n = sc.nextInt();\n        int cant = 0, suma = 0;\n        while (n != 0) {\n            cant++;\n            suma += n;\n            n = sc.nextInt();\n        }\n        System.out.println("Cantidad: " + cant);\n        System.out.println("Suma: " + suma);'),
    tests: [T('5 3 8 0\n'), T('0\n'), T('-4 10 0\n'), T('7 0 99\n')],
    hints: ['Lee el primer numero antes del ciclo y vuelve a leer al final de cada vuelta.', 'El ciclo se repite mientras <code>n != 0</code>.', 'Cuidado: lo que venga despues del 0 no se debe leer.'] }),

  mk(17, { level: 'medio', topic: 'Ciclos anidados', title: 'Triangulo de asteriscos',
    statement: 'Lee <code>n</code> e imprime un triangulo de <code>n</code> filas: la fila 1 tiene 1 asterisco, la fila 2 tiene 2, etc.<br><small>Para n = 3:</small><pre>*\n**\n***</pre>',
    starter: SC('int n = sc.nextInt();\n        // for dentro de for'),
    solution: SC('int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }'),
    tests: [T('1\n'), T('3\n'), T('5\n')],
    hints: ['El ciclo de afuera controla las filas; el de adentro, los asteriscos de cada fila.', '<code>System.out.print</code> no salta de linea; <code>System.out.println()</code> vacio si.', 'En la fila <code>i</code> imprimes <code>i</code> asteriscos.'] }),

  mk(18, { level: 'medio', topic: 'Ciclos anidados', title: 'Tabla cuadrada',
    statement: 'Lee <code>n</code> e imprime una tabla de <code>n</code> × <code>n</code> donde cada celda es el producto de su fila por su columna, separados por un espacio (sin espacio al final).<br><small>Para n = 3:</small><pre>1 2 3\n2 4 6\n3 6 9</pre>',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (j > 1) System.out.print(" ");\n                System.out.print(i * j);\n            }\n            System.out.println();\n        }'),
    tests: [T('1\n'), T('3\n'), T('4\n')],
    hints: ['Dos ciclos <code>for</code> anidados: filas <code>i</code> y columnas <code>j</code>.', 'Imprime un espacio antes de cada numero excepto el primero de la fila.'] }),

  mk(19, { level: 'medio', topic: 'Ciclos', title: 'Potencia sin Math.pow',
    statement: 'Lee una base y un exponente (enteros, exponente &ge; 0) e imprime <code>base<sup>exponente</sup></code> usando un ciclo (sin <code>Math.pow</code>). Usa <code>long</code> para el resultado.',
    starter: SC('int base = sc.nextInt();\n        int exp = sc.nextInt();\n        '),
    solution: SC('int base = sc.nextInt();\n        int exp = sc.nextInt();\n        long res = 1;\n        for (int i = 0; i < exp; i++) {\n            res *= base;\n        }\n        System.out.println(res);'),
    tests: [T('2 10\n'), T('5 0\n'), T('3 4\n'), T('-2 3\n'), T('10 12\n')],
    hints: ['Parte de <code>long res = 1;</code> y multiplica por la base <code>exp</code> veces.', 'Cualquier numero elevado a 0 vale 1.', 'Con <code>int</code> el 10<sup>12</sup> se desborda; por eso <code>long</code>.'] }),

  mk(20, { level: 'medio', topic: 'Ciclos', title: 'Factorial',
    statement: 'Lee <code>n</code> (0 &le; n &le; 20) e imprime <code>n!</code>. Recuerda que <code>0! = 1</code>. Usa <code>long</code>.',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        long f = 1;\n        for (int i = 2; i <= n; i++) {\n            f *= i;\n        }\n        System.out.println(f);'),
    tests: [T('0\n'), T('1\n'), T('5\n'), T('10\n'), T('20\n')],
    hints: ['<code>n! = 1 × 2 × 3 × ... × n</code>', 'Empieza con <code>long f = 1;</code> y multiplica en un ciclo desde 2 hasta n.'] }),

  mk(21, { level: 'medio', topic: 'Ciclos', title: 'Serie de Fibonacci',
    statement: 'Lee <code>n</code> e imprime los primeros <code>n</code> terminos de Fibonacci (0, 1, 1, 2, 3, 5...) en una sola linea separados por espacios.<br><small>n = 7 → <code>0 1 1 2 3 5 8</code></small>',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        long a = 0, b = 1;\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(a);\n            long c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(sb);'),
    tests: [T('1\n'), T('2\n'), T('7\n'), T('15\n')],
    hints: ['Cada termino es la suma de los dos anteriores.', 'Usa dos variables <code>a</code> y <code>b</code> y una tercera temporal para avanzar.', 'Puedes armar la linea con <code>StringBuilder</code> o imprimir con <code>print</code>.'] }),

  mk(22, { level: 'medio', topic: 'Ciclos', title: 'Pares en un rango',
    statement: 'Lee dos enteros <code>a</code> y <code>b</code> (con a &le; b). Imprime, en una linea separados por espacios, todos los numeros <b>pares</b> entre <code>a</code> y <code>b</code> (ambos incluidos). Si no hay ninguno, imprime <code>Ninguno</code>.',
    starter: SC('int a = sc.nextInt();\n        int b = sc.nextInt();\n        '),
    solution: SC('int a = sc.nextInt();\n        int b = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = a; i <= b; i++) {\n            if (i % 2 == 0) {\n                if (sb.length() > 0) sb.append(" ");\n                sb.append(i);\n            }\n        }\n        System.out.println(sb.length() == 0 ? "Ninguno" : sb.toString());'),
    tests: [T('1 10\n'), T('3 3\n'), T('4 4\n'), T('-3 3\n')],
    hints: ['Recorre de <code>a</code> a <code>b</code> y prueba <code>i % 2 == 0</code>.', 'Cuidado con los negativos: <code>-2 % 2</code> tambien es 0.', 'Arma el texto con un <code>StringBuilder</code> para controlar los espacios.'] }),

  mk(23, { level: 'dificil', topic: 'Ciclos anidados', title: 'Piramide centrada',
    statement: 'Lee <code>n</code> e imprime una piramide de <code>n</code> filas centrada: la fila <code>i</code> lleva <code>n-i</code> espacios a la izquierda y luego <code>2i-1</code> asteriscos (sin espacios al final).<br><small>Para n = 3:</small><pre>  *\n ***\n*****</pre>',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int s = 0; s < n - i; s++) System.out.print(" ");\n            for (int k = 0; k < 2 * i - 1; k++) System.out.print("*");\n            System.out.println();\n        }'),
    tests: [T('1\n'), T('3\n'), T('5\n')],
    hints: ['Cada fila necesita dos ciclos internos: uno para espacios y otro para asteriscos.', 'Espacios: <code>n - i</code>. Asteriscos: <code>2 * i - 1</code>.'] }),

  mk(24, { level: 'dificil', topic: 'Ciclos', title: 'MCD y MCM',
    statement: 'Lee dos enteros positivos. Imprime su <b>maximo comun divisor</b> y su <b>minimo comun multiplo</b> en el formato:<pre>MCD: 6\nMCM: 12</pre>Pista matematica: <code>MCM = (a × b) / MCD</code>. El algoritmo de Euclides calcula el MCD con residuos.',
    starter: SC('long a = sc.nextLong();\n        long b = sc.nextLong();\n        '),
    solution: SC('long a = sc.nextLong();\n        long b = sc.nextLong();\n        long x = a, y = b;\n        while (y != 0) {\n            long t = x % y;\n            x = y;\n            y = t;\n        }\n        System.out.println("MCD: " + x);\n        System.out.println("MCM: " + (a * b / x));'),
    tests: [T('12 18\n'), T('7 13\n'), T('100 25\n'), T('1 1\n'), T('48 180\n')],
    hints: ['Euclides: mientras <code>y != 0</code>, reemplaza <code>(x, y)</code> por <code>(y, x % y)</code>.', 'Cuando termina, <code>x</code> es el MCD.', 'Calcula el MCM con <code>a * b / mcd</code>.'] }),

  mk(25, { level: 'dificil', topic: 'Ciclos anidados', title: 'Numeros perfectos',
    statement: 'Un numero es <b>perfecto</b> si es igual a la suma de sus divisores propios (sin contarse a si mismo). Ejemplo: 6 = 1 + 2 + 3. Lee <code>n</code> e imprime, en una linea separados por espacios, todos los perfectos entre 1 y <code>n</code>. Si no hay ninguno, imprime <code>Ninguno</code>.',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int x = 2; x <= n; x++) {\n            int suma = 0;\n            for (int d = 1; d < x; d++) {\n                if (x % d == 0) suma += d;\n            }\n            if (suma == x) {\n                if (sb.length() > 0) sb.append(" ");\n                sb.append(x);\n            }\n        }\n        System.out.println(sb.length() == 0 ? "Ninguno" : sb.toString());'),
    tests: [T('5\n'), T('6\n'), T('30\n'), T('500\n')],
    hints: ['Para cada <code>x</code> suma sus divisores desde 1 hasta x-1 con un segundo ciclo.', 'Si la suma es igual a <code>x</code>, es perfecto.'] }),

  mk(26, { level: 'dificil', topic: 'Ciclos', title: 'Palindromo numerico',
    statement: 'Lee un entero no negativo. Con un ciclo, invierte sus digitos usando solo aritmetica (<code>%</code> y <code>/</code>, <b>sin</b> convertir a texto). Imprime <code>Palindromo</code> si el numero es igual a su inverso o <code>No palindromo</code> si no.',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        int original = n, inv = 0;\n        while (n > 0) {\n            inv = inv * 10 + n % 10;\n            n /= 10;\n        }\n        System.out.println(original == inv ? "Palindromo" : "No palindromo");'),
    tests: [T('121\n'), T('123\n'), T('7\n'), T('0\n'), T('1221\n'), T('10\n')],
    hints: ['Guarda el numero original antes de modificarlo.', 'Cada vuelta: <code>inv = inv * 10 + n % 10; n = n / 10;</code>', 'Compara <code>original</code> con <code>inv</code> al terminar.'] })
];
