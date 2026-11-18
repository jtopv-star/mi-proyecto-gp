// Ayudas para escribir ejercicios Java. Las salidas esperadas de los tests nuevos se generan
// con tools/gen-expected.mjs (ejecutando la solución en un JDK real) y se guardan en expected.js.
export const r = String.raw;
export const SC = (body = '// tu codigo aqui') => `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ${body}\n    }\n}\n`;
export const NOSC = (body = '// tu codigo aqui') => `public class Main {\n    public static void main(String[] args) {\n        ${body}\n    }\n}\n`;
export const mkJ = (world) => (n, o) => ({ id: 'java-' + String(n).padStart(3, '0'), area: 'java', world, ...o });
export const T = (input, expected) => (expected === undefined ? { input } : { input, expected });
