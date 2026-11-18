import { r, SC, NOSC, mkJ, T } from './_java.js';
const mk = mkJ('java-3');
const CLS = (body) => `import java.util.*;\n\npublic class Main {\n${body}\n}\n`;

export default [
  /* ---------- Metodos ---------- */
  mk(27, { level: 'facil', topic: 'Metodos', title: 'Mi primer metodo',
    statement: 'Crea un metodo <code>static int cuadrado(int x)</code> que devuelva el cuadrado de <code>x</code>. En <code>main</code>, lee un entero e imprime el resultado de llamar al metodo.',
    starter: r`import java.util.Scanner;

public class Main {
    // escribe aqui el metodo cuadrado


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // imprime cuadrado(n)
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static int cuadrado(int x) {
        return x * x;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(cuadrado(n));
    }
}
`,
    tests: [T('4\n'), T('0\n'), T('-7\n'), T('100\n')],
    hints: ['Un metodo se declara asi: <code>static int nombre(int parametro) { ... return valor; }</code>', 'Se escribe dentro de la clase, fuera de <code>main</code>.'] }),

  mk(28, { level: 'facil', topic: 'Metodos', title: 'Metodo booleano',
    statement: 'Crea un metodo <code>static boolean esPar(int n)</code>. En <code>main</code> lee un entero e imprime <code>Par</code> o <code>Impar</code> usando el metodo.',
    starter: r`import java.util.Scanner;

public class Main {
    // metodo esPar


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // usa esPar(n)
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static boolean esPar(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (esPar(n)) System.out.println("Par");
        else System.out.println("Impar");
    }
}
`,
    tests: [T('4\n'), T('7\n'), T('0\n'), T('-3\n')],
    hints: ['Un metodo <code>boolean</code> devuelve <code>true</code> o <code>false</code>.', '<code>return n % 2 == 0;</code> ya es un booleano.'] }),

  mk(29, { level: 'medio', topic: 'Metodos', title: 'El mayor de tres',
    statement: 'Crea <code>static int maximo(int a, int b, int c)</code> que devuelva el mayor de los tres. Lee tres enteros e imprime el maximo.',
    starter: r`import java.util.Scanner;

public class Main {
    // metodo maximo


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        // imprime maximo(a, b, c)
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static int maximo(int a, int b, int c) {
        int m = a;
        if (b > m) m = b;
        if (c > m) m = c;
        return m;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        System.out.println(maximo(a, b, c));
    }
}
`,
    tests: [T('1 2 3\n'), T('9 4 4\n'), T('-5 -2 -9\n'), T('7 7 7\n'), T('3 10 2\n')],
    hints: ['Guarda en una variable el mayor visto hasta ahora y comparalo con los otros dos.', 'Si no usas <code>Math.max</code>, dos <code>if</code> seguidos bastan.'] }),

  mk(30, { level: 'medio', topic: 'Metodos', title: 'Factorial recursivo',
    statement: 'Un metodo <b>recursivo</b> se llama a si mismo. Crea <code>static long factorial(int n)</code> de forma recursiva (sin ciclos) e imprime el factorial de un <code>n</code> leido (0 &le; n &le; 20).',
    starter: r`import java.util.Scanner;

public class Main {
    // metodo recursivo factorial


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // imprime factorial(n)
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}
`,
    tests: [T('0\n'), T('1\n'), T('5\n'), T('12\n'), T('20\n')],
    hints: ['Toda recursion necesita un <b>caso base</b> que detenga las llamadas: <code>factorial(0) = factorial(1) = 1</code>.', 'Caso recursivo: <code>n * factorial(n - 1)</code>.'] }),

  mk(31, { level: 'medio', topic: 'Metodos', title: 'Fibonacci recursivo',
    statement: 'Crea <code>static int fib(int n)</code> recursivo donde <code>fib(0)=0</code>, <code>fib(1)=1</code> y <code>fib(n)=fib(n-1)+fib(n-2)</code>. Lee <code>n</code> (0 &le; n &le; 25) e imprime <code>fib(n)</code>.',
    starter: r`import java.util.Scanner;

public class Main {
    // metodo fib


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // imprime fib(n)
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static int fib(int n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(fib(n));
    }
}
`,
    tests: [T('0\n'), T('1\n'), T('2\n'), T('10\n'), T('20\n')],
    hints: ['Hay dos casos base: n = 0 y n = 1.', 'Para los demas, <code>return fib(n - 1) + fib(n - 2);</code>'] }),

  mk(32, { level: 'medio', topic: 'Metodos', title: 'Sobrecarga: perimetros',
    statement: 'La <b>sobrecarga</b> permite varios metodos con el mismo nombre y distinta cantidad de parametros. Crea tres metodos <code>static int perimetro(...)</code>: con 1 parametro (<code>lado</code> de un cuadrado), con 2 (<code>largo, ancho</code> de un rectangulo) y con 3 (<code>a, b, c</code> de un triangulo). En <code>main</code> lee primero <code>k</code> (1, 2 o 3) y luego <code>k</code> enteros; imprime el perimetro llamando al metodo correspondiente.',
    starter: r`import java.util.Scanner;

public class Main {
    // tres metodos perimetro


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        // lee k numeros y llama al metodo que corresponda
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static int perimetro(int lado) { return 4 * lado; }
    static int perimetro(int largo, int ancho) { return 2 * (largo + ancho); }
    static int perimetro(int a, int b, int c) { return a + b + c; }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        if (k == 1) {
            System.out.println(perimetro(sc.nextInt()));
        } else if (k == 2) {
            int a = sc.nextInt(), b = sc.nextInt();
            System.out.println(perimetro(a, b));
        } else {
            int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
            System.out.println(perimetro(a, b, c));
        }
    }
}
`,
    tests: [T('1\n5\n'), T('2\n4 6\n'), T('3\n3 4 5\n'), T('1\n0\n'), T('2\n10 1\n')],
    hints: ['Java elige el metodo segun cuantos argumentos le pasas.', 'Cuadrado: <code>4 * lado</code>. Rectangulo: <code>2 * (largo + ancho)</code>. Triangulo: suma de lados.'] }),

  mk(33, { level: 'dificil', topic: 'Metodos', title: 'Los primeros primos',
    statement: 'Crea <code>static boolean esPrimo(int n)</code> y usalo para imprimir, en una linea separados por espacios, los primeros <code>n</code> numeros primos (n &ge; 1).<br><small>n = 6 → <code>2 3 5 7 11 13</code></small>',
    starter: r`import java.util.Scanner;

public class Main {
    // metodo esPrimo


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // imprime los primeros n primos
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static boolean esPrimo(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        int encontrados = 0, x = 2;
        while (encontrados < n) {
            if (esPrimo(x)) {
                if (encontrados > 0) sb.append(" ");
                sb.append(x);
                encontrados++;
            }
            x++;
        }
        System.out.println(sb);
    }
}
`,
    tests: [T('1\n'), T('6\n'), T('15\n'), T('30\n')],
    hints: ['Un ciclo <code>while</code> que cuenta cuantos primos llevas, no cuantos numeros probaste.', 'Prueba <code>x = 2, 3, 4...</code> y aumenta el contador solo cuando <code>esPrimo(x)</code> sea verdadero.'] }),

  mk(34, { level: 'dificil', topic: 'Metodos', title: 'Torres de Hanoi',
    statement: 'Resuelve las <b>Torres de Hanoi</b> con recursion. Lee <code>n</code> (discos, 1 &le; n &le; 5) e imprime cada movimiento con el formato <code>Mover disco 1 de A a C</code>, moviendo desde la torre <code>A</code> hacia <code>C</code> usando <code>B</code> como auxiliar. Al final imprime <code>Total: X</code> con la cantidad de movimientos.<br><small>n = 2:</small><pre>Mover disco 1 de A a B\nMover disco 2 de A a C\nMover disco 1 de B a C\nTotal: 3</pre>',
    starter: r`import java.util.Scanner;

public class Main {
    static int total = 0;

    // static void hanoi(int n, char origen, char destino, char auxiliar)


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // hanoi(n, 'A', 'C', 'B');
        // imprime Total
    }
}
`,
    solution: r`import java.util.Scanner;

public class Main {
    static int total = 0;

    static void hanoi(int n, char origen, char destino, char auxiliar) {
        if (n == 0) return;
        hanoi(n - 1, origen, auxiliar, destino);
        System.out.println("Mover disco " + n + " de " + origen + " a " + destino);
        total++;
        hanoi(n - 1, auxiliar, destino, origen);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        hanoi(n, 'A', 'C', 'B');
        System.out.println("Total: " + total);
    }
}
`,
    tests: [T('1\n'), T('2\n'), T('3\n'), T('5\n')],
    hints: ['Para mover <code>n</code> discos: 1) mueve <code>n-1</code> al auxiliar, 2) mueve el disco <code>n</code> al destino, 3) mueve los <code>n-1</code> del auxiliar al destino.', 'Caso base: con 0 discos no hay nada que hacer.', 'Las torres se intercambian de papel en cada llamada recursiva.'] }),

  /* ---------- Arreglos ---------- */
  mk(35, { level: 'facil', topic: 'Arreglos', title: 'Suma de un arreglo',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Guardalos en un arreglo <code>int[]</code> e imprime la suma de todos.',
    starter: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        // llena el arreglo y suma'),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        int suma = 0;\n        for (int i = 0; i < n; i++) {\n            v[i] = sc.nextInt();\n            suma += v[i];\n        }\n        System.out.println(suma);'),
    tests: [T('3\n1 2 3\n'), T('1\n-5\n'), T('5\n10 20 30 40 50\n'), T('4\n-1 1 -1 1\n')],
    hints: ['<code>int[] v = new int[n];</code> crea el arreglo; sus posiciones van de 0 a n-1.', 'Un <code>for</code> con <code>v[i] = sc.nextInt();</code> lo llena.'] }),

  mk(36, { level: 'medio', topic: 'Arreglos', title: 'Al reves',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Imprime los numeros en <b>orden inverso</b>, separados por un espacio, en una sola linea.',
    starter: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        '),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        for (int i = 0; i < n; i++) v[i] = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = n - 1; i >= 0; i--) {\n            sb.append(v[i]);\n            if (i > 0) sb.append(" ");\n        }\n        System.out.println(sb);'),
    tests: [T('3\n1 2 3\n'), T('1\n9\n'), T('5\n5 4 3 2 1\n'), T('4\n7 -1 0 8\n')],
    hints: ['Recorre el arreglo con <code>for (int i = n - 1; i &gt;= 0; i--)</code>.', 'Cuida los espacios: ninguno despues del ultimo numero.'] }),

  mk(37, { level: 'medio', topic: 'Arreglos', title: 'Pares e impares',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Imprime cuantos son pares y cuantos impares:<pre>Pares: 2\nImpares: 3</pre>',
    starter: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        '),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        int pares = 0, impares = 0;\n        for (int i = 0; i < n; i++) {\n            v[i] = sc.nextInt();\n            if (v[i] % 2 == 0) pares++;\n            else impares++;\n        }\n        System.out.println("Pares: " + pares);\n        System.out.println("Impares: " + impares);'),
    tests: [T('5\n1 2 3 4 5\n'), T('3\n2 4 6\n'), T('2\n-3 -4\n'), T('1\n0\n')],
    hints: ['Dos contadores, uno por cada tipo.', 'Para negativos <code>-3 % 2</code> da <code>-1</code>, asi que usa <code>% 2 == 0</code> para pares (no <code>== 1</code> para impares).'] }),

  mk(38, { level: 'medio', topic: 'Arreglos', title: 'Promedio',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Imprime el promedio como <code>double</code> con <code>System.out.println</code> (por ejemplo <code>4.0</code> o <code>2.5</code>).<br><small>Cuidado con la division entre enteros.</small>',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        int suma = 0;\n        for (int i = 0; i < n; i++) suma += sc.nextInt();\n        double prom = (double) suma / n;\n        System.out.println(prom);'),
    tests: [T('2\n3 5\n'), T('2\n1 2\n'), T('4\n10 20 30 40\n'), T('1\n7\n'), T('4\n1 1 1 2\n')],
    hints: ['<code>suma / n</code> con enteros descarta los decimales.', 'Convierte uno a double: <code>(double) suma / n</code>.'] }),

  mk(39, { level: 'medio', topic: 'Arreglos', title: 'Buscar un elemento',
    statement: 'Lee <code>n</code>, luego <code>n</code> enteros y por ultimo un valor <code>x</code>. Imprime la <b>posicion</b> (empezando en 0) de la <b>primera</b> aparicion de <code>x</code>, o <code>-1</code> si no esta.',
    starter: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        '),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        for (int i = 0; i < n; i++) v[i] = sc.nextInt();\n        int x = sc.nextInt();\n        int pos = -1;\n        for (int i = 0; i < n; i++) {\n            if (v[i] == x) {\n                pos = i;\n                break;\n            }\n        }\n        System.out.println(pos);'),
    tests: [T('5\n4 8 15 16 23\n15\n'), T('3\n1 2 3\n9\n'), T('5\n7 7 7 7 7\n7\n'), T('1\n5\n5\n'), T('4\n3 1 3 1\n1\n')],
    hints: ['Empieza con <code>pos = -1</code> y cambialo cuando encuentres el valor.', 'Con <code>break</code> te quedas con la primera aparicion.'] }),

  mk(40, { level: 'medio', topic: 'Arreglos', title: 'Ordenar de menor a mayor',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Imprimelos <b>ordenados de menor a mayor</b> en una linea separados por espacios. (Puedes usar <code>Arrays.sort</code>, pero te recomiendo intentar con el metodo de burbuja.)',
    starter: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        '),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        for (int i = 0; i < n; i++) v[i] = sc.nextInt();\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (v[j] > v[j + 1]) {\n                    int t = v[j];\n                    v[j] = v[j + 1];\n                    v[j + 1] = t;\n                }\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(v[i]);\n        }\n        System.out.println(sb);'),
    tests: [T('5\n5 3 1 4 2\n'), T('1\n9\n'), T('4\n-1 -5 0 3\n'), T('6\n2 2 1 1 3 3\n'), T('3\n1 2 3\n')],
    hints: ['Burbuja: compara cada par vecino <code>v[j]</code> y <code>v[j+1]</code> y los intercambias si estan al reves.', 'Repite eso <code>n-1</code> veces.', 'Para intercambiar necesitas una variable temporal.'] }),

  mk(41, { level: 'dificil', topic: 'Arreglos', title: 'El segundo mayor',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Imprime el <b>segundo valor mas grande distinto del mayor</b>. Si todos los numeros son iguales (no existe un segundo), imprime <code>No existe</code>.<br><small>Ejemplo: <code>9 9 5 2</code> → <code>5</code></small>',
    starter: SC('int n = sc.nextInt();\n        '),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        for (int i = 0; i < n; i++) v[i] = sc.nextInt();\n        int mayor = v[0];\n        for (int i = 1; i < n; i++) if (v[i] > mayor) mayor = v[i];\n        boolean hay = false;\n        int segundo = 0;\n        for (int i = 0; i < n; i++) {\n            if (v[i] < mayor && (!hay || v[i] > segundo)) {\n                segundo = v[i];\n                hay = true;\n            }\n        }\n        System.out.println(hay ? String.valueOf(segundo) : "No existe");'),
    tests: [T('5\n4 8 15 16 23\n'), T('4\n9 9 5 2\n'), T('3\n7 7 7\n'), T('1\n5\n'), T('4\n-1 -5 -3 -1\n'), T('2\n1 2\n')],
    hints: ['Primero halla el mayor. Luego busca el mayor entre los que son <b>menores</b> que ese.', 'Necesitas saber si ya encontraste alguno (una variable <code>boolean</code>), porque 0 tambien puede ser una respuesta valida.'] }),

  mk(42, { level: 'dificil', topic: 'Arreglos', title: 'Rotar a la derecha',
    statement: 'Lee <code>n</code>, luego <code>n</code> enteros y por ultimo <code>k</code> (&ge; 0). Rota el arreglo <code>k</code> posiciones a la <b>derecha</b> e imprimelo separado por espacios.<br><small>Ejemplo: <code>1 2 3 4 5</code> con k = 2 → <code>4 5 1 2 3</code></small>',
    starter: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        '),
    solution: SC('int n = sc.nextInt();\n        int[] v = new int[n];\n        for (int i = 0; i < n; i++) v[i] = sc.nextInt();\n        int k = sc.nextInt() % n;\n        int[] r = new int[n];\n        for (int i = 0; i < n; i++) {\n            r[(i + k) % n] = v[i];\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(r[i]);\n        }\n        System.out.println(sb);'),
    tests: [T('5\n1 2 3 4 5\n2\n'), T('3\n1 2 3\n0\n'), T('3\n1 2 3\n3\n'), T('4\n1 2 3 4\n9\n'), T('1\n8\n5\n')],
    hints: ['El elemento de la posicion <code>i</code> termina en <code>(i + k) % n</code>.', 'Si <code>k</code> es mayor que <code>n</code>, solo importa <code>k % n</code>.', 'Usa un arreglo auxiliar para el resultado.'] }),

  mk(43, { level: 'dificil', topic: 'Arreglos', title: 'Matriz transpuesta',
    statement: 'Lee <code>f</code> y <code>c</code> (filas y columnas) y luego los <code>f × c</code> enteros de una matriz. Imprime su <b>transpuesta</b> (<code>c</code> filas y <code>f</code> columnas), con los numeros de cada fila separados por un espacio.<br><small>Entrada <code>2 3</code> / <code>1 2 3</code> / <code>4 5 6</code> →</small><pre>1 4\n2 5\n3 6</pre>',
    starter: SC('int f = sc.nextInt();\n        int c = sc.nextInt();\n        int[][] m = new int[f][c];\n        '),
    solution: SC('int f = sc.nextInt();\n        int c = sc.nextInt();\n        int[][] m = new int[f][c];\n        for (int i = 0; i < f; i++)\n            for (int j = 0; j < c; j++)\n                m[i][j] = sc.nextInt();\n        for (int j = 0; j < c; j++) {\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < f; i++) {\n                if (i > 0) sb.append(" ");\n                sb.append(m[i][j]);\n            }\n            System.out.println(sb);\n        }'),
    tests: [T('2 3\n1 2 3\n4 5 6\n'), T('1 1\n7\n'), T('3 2\n1 2\n3 4\n5 6\n'), T('2 2\n1 2\n3 4\n')],
    hints: ['Una matriz se declara <code>int[][] m = new int[f][c];</code> y se accede con <code>m[i][j]</code>.', 'Para la transpuesta, el ciclo de afuera recorre las <b>columnas</b> y el de adentro las filas.'] }),

  mk(44, { level: 'dificil', topic: 'Arreglos', title: 'Diagonales',
    statement: 'Lee <code>n</code> y luego una matriz cuadrada de <code>n × n</code> enteros. Imprime la suma de la diagonal principal y la de la secundaria:<pre>Principal: 15\nSecundaria: 15</pre>',
    starter: SC('int n = sc.nextInt();\n        int[][] m = new int[n][n];\n        '),
    solution: SC('int n = sc.nextInt();\n        int[][] m = new int[n][n];\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < n; j++)\n                m[i][j] = sc.nextInt();\n        int p = 0, s = 0;\n        for (int i = 0; i < n; i++) {\n            p += m[i][i];\n            s += m[i][n - 1 - i];\n        }\n        System.out.println("Principal: " + p);\n        System.out.println("Secundaria: " + s);'),
    tests: [T('3\n1 2 3\n4 5 6\n7 8 9\n'), T('1\n5\n'), T('2\n1 2\n3 4\n'), T('4\n1 0 0 2\n0 3 4 0\n0 5 6 0\n7 0 0 8\n')],
    hints: ['Diagonal principal: posiciones <code>m[i][i]</code>.', 'Diagonal secundaria: <code>m[i][n - 1 - i]</code>.', 'No necesitas dos ciclos para sumarlas, solo uno.'] }),

  /* ---------- ArrayList ---------- */
  mk(45, { level: 'medio', topic: 'ArrayList', title: 'Mi primer ArrayList',
    statement: 'Lee enteros hasta que llegue un <code>0</code> (no se guarda) y guardalos en un <code>ArrayList&lt;Integer&gt;</code>. Imprime la cantidad de elementos y la lista completa tal como la imprime Java:<pre>Cantidad: 3\n[5, 3, 8]</pre>',
    starter: r`import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Integer> lista = new ArrayList<>();
        // lee hasta el 0
    }
}
`,
    solution: r`import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Integer> lista = new ArrayList<>();
        int x = sc.nextInt();
        while (x != 0) {
            lista.add(x);
            x = sc.nextInt();
        }
        System.out.println("Cantidad: " + lista.size());
        System.out.println(lista);
    }
}
`,
    tests: [T('5 3 8 0\n'), T('0\n'), T('-1 -2 0 9\n'), T('7 0\n')],
    hints: ['<code>lista.add(x)</code> agrega; <code>lista.size()</code> da la cantidad.', 'Imprimir la lista directamente con <code>System.out.println(lista)</code> ya da el formato <code>[a, b, c]</code>.'] }),

  mk(46, { level: 'medio', topic: 'ArrayList', title: 'Quitar repetidos',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros. Imprime la lista sin numeros repetidos <b>conservando el orden de la primera aparicion</b>, separados por espacios.<br><small><code>3 1 3 2 1</code> → <code>3 1 2</code></small>',
    starter: r`import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> unicos = new ArrayList<>();
        // para cada numero, agregalo solo si no esta
    }
}
`,
    solution: r`import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> unicos = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (!unicos.contains(x)) unicos.add(x);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < unicos.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(unicos.get(i));
        }
        System.out.println(sb);
    }
}
`,
    tests: [T('5\n3 1 3 2 1\n'), T('3\n4 4 4\n'), T('4\n1 2 3 4\n'), T('1\n9\n'), T('6\n5 -1 5 -1 0 0\n')],
    hints: ['<code>lista.contains(x)</code> responde si ya esta.', '<code>lista.get(i)</code> obtiene el elemento de la posicion <code>i</code>.'] }),

  mk(47, { level: 'medio', topic: 'ArrayList', title: 'Palabras en orden alfabetico',
    statement: 'Lee <code>n</code> y luego <code>n</code> palabras (una por linea o separadas por espacios, sin tildes ni mayusculas). Guardalas en un <code>ArrayList&lt;String&gt;</code>, ordenalas alfabeticamente con <code>Collections.sort</code> e imprime una palabra por linea.',
    starter: r`import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> palabras = new ArrayList<>();
        // lee las palabras con sc.next()
    }
}
`,
    solution: r`import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> palabras = new ArrayList<>();
        for (int i = 0; i < n; i++) palabras.add(sc.next());
        Collections.sort(palabras);
        for (String p : palabras) System.out.println(p);
    }
}
`,
    tests: [T('3\nmanzana\nbanana\ncereza\n'), T('1\nuva\n'), T('4\nzeta alfa beta alfa\n'), T('2\nabc ab\n')],
    hints: ['<code>sc.next()</code> lee una palabra.', '<code>Collections.sort(lista);</code> ordena la lista en su lugar.', 'Para recorrer: <code>for (String p : palabras) { ... }</code>'] }),

  mk(48, { level: 'dificil', topic: 'ArrayList', title: 'Eliminar los pares',
    statement: 'Lee <code>n</code> y luego <code>n</code> enteros en un <code>ArrayList&lt;Integer&gt;</code>. <b>Elimina de la lista</b> todos los numeros pares (modificando la lista, no creando otra) e imprime la lista resultante con <code>System.out.println(lista)</code>.<br><small>Cuidado: al borrar mientras recorres, los indices se corren.</small>',
    starter: r`import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> lista = new ArrayList<>();
        for (int i = 0; i < n; i++) lista.add(sc.nextInt());
        // elimina los pares
        System.out.println(lista);
    }
}
`,
    solution: r`import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> lista = new ArrayList<>();
        for (int i = 0; i < n; i++) lista.add(sc.nextInt());
        for (int i = lista.size() - 1; i >= 0; i--) {
            if (lista.get(i) % 2 == 0) lista.remove(i);
        }
        System.out.println(lista);
    }
}
`,
    tests: [T('6\n1 2 3 4 5 6\n'), T('3\n2 4 6\n'), T('4\n1 3 5 7\n'), T('5\n2 2 3 4 4\n'), T('1\n0\n')],
    hints: ['Si recorres de izquierda a derecha y borras, saltas elementos. Recorre <b>de atras hacia adelante</b>.', '<code>lista.remove(i)</code> con un <code>int</code> borra por posicion.'] }),

  /* ---------- Cadenas ---------- */
  mk(49, { level: 'facil', topic: 'Cadenas', title: 'Longitud y mayusculas',
    statement: 'Lee una linea de texto con <code>sc.nextLine()</code> e imprime en una linea su <b>longitud</b> y en la siguiente el texto en <b>MAYUSCULAS</b>.<br><small>Entrada <code>hola mundo</code> → <code>10</code> y <code>HOLA MUNDO</code></small>',
    starter: SC('String s = sc.nextLine();\n        '),
    solution: SC('String s = sc.nextLine();\n        System.out.println(s.length());\n        System.out.println(s.toUpperCase());'),
    tests: [T('hola mundo\n'), T('Java\n'), T('a\n'), T('Programar es divertido\n')],
    hints: ['<code>s.length()</code> cuenta los caracteres (incluye espacios).', '<code>s.toUpperCase()</code> devuelve el texto en mayusculas.'] }),

  mk(50, { level: 'medio', topic: 'Cadenas', title: 'Contar vocales',
    statement: 'Lee una linea de texto (sin tildes) e imprime cuantas <b>vocales</b> tiene (a, e, i, o, u, sin importar mayusculas o minusculas).',
    starter: SC('String s = sc.nextLine();\n        '),
    solution: SC('String s = sc.nextLine().toLowerCase();\n        int cont = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') cont++;\n        }\n        System.out.println(cont);'),
    tests: [T('hola mundo\n'), T('AEIOU aeiou\n'), T('rhythm\n'), T('Programacion en Java\n'), T('x\n')],
    hints: ['<code>s.charAt(i)</code> da el caracter de la posicion <code>i</code>.', 'Pasa todo a minusculas con <code>toLowerCase()</code> para comparar menos casos.'] }),

  mk(51, { level: 'medio', topic: 'Cadenas', title: 'Invertir una cadena',
    statement: 'Lee una linea de texto e imprimela <b>al reves</b> usando un ciclo (sin <code>StringBuilder.reverse()</code>).<br><small><code>Java</code> → <code>avaJ</code></small>',
    starter: SC('String s = sc.nextLine();\n        '),
    solution: SC('String s = sc.nextLine();\n        String r = "";\n        for (int i = s.length() - 1; i >= 0; i--) {\n            r += s.charAt(i);\n        }\n        System.out.println(r);'),
    tests: [T('Java\n'), T('a\n'), T('hola mundo\n'), T('12345\n'), T('ab cd\n')],
    hints: ['Recorre desde <code>s.length() - 1</code> hasta 0.', 'Concatena cada caracter a una cadena resultado: <code>r += s.charAt(i);</code>'] }),

  mk(52, { level: 'medio', topic: 'Cadenas', title: 'Palindromo de texto',
    statement: 'Lee una linea de texto. Ignorando <b>espacios y mayusculas</b>, imprime <code>Si</code> si se lee igual al derecho y al reves, o <code>No</code> si no.<br><small><code>Anita lava la tina</code> → <code>Si</code></small>',
    starter: SC('String s = sc.nextLine();\n        '),
    solution: SC('String s = sc.nextLine().replace(" ", "").toLowerCase();\n        boolean ok = true;\n        for (int i = 0; i < s.length() / 2; i++) {\n            if (s.charAt(i) != s.charAt(s.length() - 1 - i)) {\n                ok = false;\n                break;\n            }\n        }\n        System.out.println(ok ? "Si" : "No");'),
    tests: [T('Anita lava la tina\n'), T('hola\n'), T('a\n'), T('Reconocer\n'), T('Dabale arroz a la zorra el abad\n'), T('ab\n')],
    hints: ['<code>s.replace(" ", "")</code> quita los espacios y <code>toLowerCase()</code> iguala las letras.', 'Compara el caracter <code>i</code> con el caracter <code>length - 1 - i</code> hasta la mitad.'] }),

  mk(53, { level: 'dificil', topic: 'Cadenas', title: 'Palabras y la mas larga',
    statement: 'Lee una linea de texto con palabras separadas por <b>uno o mas espacios</b>. Imprime la cantidad de palabras y la palabra <b>mas larga</b> (si hay empate, la primera):<pre>Palabras: 4\nMas larga: programar</pre>Si la linea esta vacia imprime <code>Palabras: 0</code> y <code>Mas larga: -</code>.',
    starter: SC('String linea = sc.hasNextLine() ? sc.nextLine() : "";\n        '),
    solution: SC('String linea = sc.hasNextLine() ? sc.nextLine() : "";\n        String[] partes = linea.trim().isEmpty() ? new String[0] : linea.trim().split("\\\\s+");\n        String mayor = "-";\n        int max = -1;\n        for (String p : partes) {\n            if (p.length() > max) {\n                max = p.length();\n                mayor = p;\n            }\n        }\n        System.out.println("Palabras: " + partes.length);\n        System.out.println("Mas larga: " + mayor);'),
    tests: [T('me gusta programar mucho\n'), T('hola\n'), T('  uno   dos  tres  \n'), T('\n'), T('aa bb cc\n'), T('a bbb cc ddd\n')],
    hints: ['<code>linea.trim().split("\\\\s+")</code> parte el texto en palabras aunque haya varios espacios.', 'Cuidado: <code>"".split(...)</code> devuelve un arreglo con 1 elemento vacio, no con 0.', 'Para quedarte con la primera en un empate usa <code>&gt;</code> (no <code>&gt;=</code>).'] }),

  mk(54, { level: 'dificil', topic: 'Cadenas', title: 'Cifrado Cesar',
    statement: 'Lee un entero <code>k</code> (0 &le; k &le; 25) en la primera linea y un texto en la segunda. Desplaza cada <b>letra</b> del alfabeto ingles <code>k</code> posiciones hacia adelante (de la <code>z</code> vuelve a la <code>a</code>), respetando mayusculas y minusculas. Los demas caracteres (espacios, numeros, signos) no cambian.<br><small>k = 3, <code>Hola, Zeta!</code> → <code>Krod, Chwd!</code></small>',
    starter: SC('int k = sc.nextInt();\n        sc.nextLine();\n        String s = sc.nextLine();\n        '),
    solution: SC('int k = sc.nextInt();\n        sc.nextLine();\n        String s = sc.nextLine();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c >= \'a\' && c <= \'z\') sb.append((char) (\'a\' + (c - \'a\' + k) % 26));\n            else if (c >= \'A\' && c <= \'Z\') sb.append((char) (\'A\' + (c - \'A\' + k) % 26));\n            else sb.append(c);\n        }\n        System.out.println(sb);'),
    tests: [T('3\nHola, Zeta!\n'), T('0\nSin cambios 123\n'), T('13\nabcxyz ABCXYZ\n'), T('25\nJava\n'), T('1\nzZ aA\n')],
    hints: ['Despues de <code>nextInt()</code> usa <code>sc.nextLine();</code> para consumir el salto de linea antes de leer el texto.', 'Para una minuscula: <code>(char) (\'a\' + (c - \'a\' + k) % 26)</code>. Las mayusculas son iguales con <code>\'A\'</code>.', 'Revisa si es letra con <code>c &gt;= \'a\' &amp;&amp; c &lt;= \'z\'</code>.'] })
];
