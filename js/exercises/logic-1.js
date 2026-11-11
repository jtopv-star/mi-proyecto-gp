const q = (n, o) => ({ id: 'log-' + String(n).padStart(3, '0'), area: 'java', world: 'logic-1', type: 'quiz', ...o });

export default [
  q(1, { level: 'facil', topic: 'Algoritmos', title: 'El residuo',
    statement: 'Sigue el algoritmo:<pre>x ← 17\ny ← 5\nimprimir(x MOD y)</pre>¿Qué se imprime? (<code>MOD</code> es el residuo de la división entera)',
    options: ['3', '2', '3.4', '5'], answer: 1,
    explanation: '17 ÷ 5 = 3 y sobran 2, por eso 17 MOD 5 = 2.' }),
  q(2, { level: 'facil', topic: 'Ciclos', title: 'Sigue el ciclo',
    statement: '<pre>suma ← 0\nPARA i ← 1 HASTA 4\n    suma ← suma + i\nFIN PARA\nimprimir(suma)</pre>¿Qué valor se imprime?',
    options: ['4', '6', '10', '24'], answer: 2,
    explanation: 'La suma va: 0+1=1, 1+2=3, 3+3=6, 6+4=10.' }),
  q(3, { level: 'medio', topic: 'Condicionales', title: '¿Qué rama se ejecuta?',
    statement: '<pre>a ← 4\nb ← 2\nSI (a &gt; 3 Y b &lt; 2) ENTONCES\n    imprimir("A")\nSINO SI (a &gt; 3 O b &lt; 2) ENTONCES\n    imprimir("B")\nSINO\n    imprimir("C")</pre>¿Qué se imprime?',
    options: ['A', 'B', 'C', 'A y B'], answer: 1,
    explanation: 'Primera condición: a&gt;3 es verdadero pero b&lt;2 es falso, con Y el resultado es falso. Segunda: con O basta que una sea verdadera (a&gt;3), por eso imprime B.' }),
  q(4, { level: 'medio', topic: 'Ciclos', title: 'Cuántas vueltas da',
    statement: '<pre>i ← 10\ncontador ← 0\nMIENTRAS i &gt; 0\n    i ← i - 3\n    contador ← contador + 1\nFIN MIENTRAS\nimprimir(contador)</pre>¿Qué valor tiene <code>contador</code> al final?',
    options: ['3', '4', '5', '10'], answer: 1,
    explanation: 'i toma los valores 10 → 7 → 4 → 1 → −2. Se resta 4 veces antes de que i deje de ser mayor que 0.' }),
  q(5, { level: 'medio', topic: 'Algoritmos', title: 'Ordena el algoritmo',
    statement: 'Para calcular el <b>promedio de 3 notas</b>, ¿cuál es el orden correcto de los pasos?',
    options: ['Sumar las notas → leer las notas → dividir entre 3 → mostrar', 'Leer las notas → sumarlas → dividir entre 3 → mostrar el resultado', 'Dividir entre 3 → leer las notas → sumarlas → mostrar', 'Mostrar → leer → sumar → dividir'], answer: 1,
    explanation: 'Un algoritmo es una secuencia ordenada: primero necesitas los datos (entrada), luego procesarlos (suma y división) y al final mostrar la salida.' })
];
